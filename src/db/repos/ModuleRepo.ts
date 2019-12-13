import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {Module, User, Workspace} from '../entities';
import {nextSnowflake} from '../../util/snowflake';
import {Runtime} from '../../constants';

interface ModuleCreateData {
  name: string;
  body: string;
  runtime: Runtime;
  workspace: Workspace;
  user: User;
}

@EntityRepository(Module)
export class ModuleRepo extends Repository<Module> {
  public async findOneIfUserCanRead(id: string, user: User): Promise<Module | null> {
    // It's only going to find it if it both exists *and* is owned by the user
    // Basically 404s rather than 403ing when perms aren't ok
    // TODO REQUIRED implement basic workspace perm checks
    return await this.findOne({id}) || null;
  }
  public async createAndSave({name, body, runtime, workspace, user}: ModuleCreateData) {
    const module = new Module();
    module.id = await nextSnowflake();
    module.name = name;
    module.body = body;
    module.runtime = runtime;
    module.workspaceId = workspace.id;
    module.createdById = user.id;

    return this.save(module);
  }
}

export const getModuleRepo = () => getCustomRepository(ModuleRepo);
