import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {Script, Bot, Platform, User} from '../entities';
import {nextSnowflake} from '../../util/snowflake';

interface ScriptCreateData {
  name: string;
  body: string;
  platform: Platform;
  owner: User;
}

@EntityRepository(Script)
export class ScriptRepository extends Repository<Script> {
  public async findOneIfUserCanRead(id: string, user: User): Promise<Script | null> {
    // It's only going to find it if it both exists *and* is owned by the user
    // Basically 404s rather than 403ing when perms aren't ok
    return await this.findOne({id, resourceOwnerId: user.id}) || null;
  }
  public async createAndSave({name, body, platform, owner}: ScriptCreateData) {
    const script = new Script();
    script.id = await nextSnowflake();
    script.name = name;
    script.body = body;
    script.platform = platform;
    script.resourceOwnerId = owner.id;
    script.createdById = owner.id;
    return this.save(script);
  }
}

export const getScriptRepo = () => getCustomRepository(ScriptRepository);
