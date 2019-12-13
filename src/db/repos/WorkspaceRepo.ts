import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {User, Workspace} from '../entities';
import {nextSnowflake} from '../../util/snowflake';

interface WorkspaceCreateData {
  user: User | string;
  name: string;
  personal?: boolean;
}

function id(user: User | string): string {
  return typeof user === 'string' ? user : user.id;
}

@EntityRepository(Workspace)
export class WorkspaceRepo extends Repository<Workspace> {
  public async findOneIfUserCanRead(workspaceId: string, user: User): Promise<Workspace | null> {
    // It's only going to find it if it both exists *and* is owned by the user
    // Basically 404s rather than 403ing when perms aren't ok
    return await this.findOne({id: workspaceId, resourceOwnerId: user.id}) || null;
  }

  public async createAndSave({user, name, personal}: WorkspaceCreateData) {
    const workspace = new Workspace();

    workspace.id = personal ? id(user) : await nextSnowflake();
    workspace.resourceOwnerId = id(user);
    workspace.name = name;
    workspace.createdById = id(user);
    workspace.isPersonal = !!personal;

    return this.save(workspace);
  }

}

export const getWorkspaceRepo = () => getCustomRepository(WorkspaceRepo);
