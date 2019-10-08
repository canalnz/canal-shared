import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {ScriptLink, User} from '../entities';
import {pubsub} from '../../pubsub';

export interface CreateScriptLinkData {
  script: string;
  bot: string;
  user: User;
}

@EntityRepository(ScriptLink)
export class ScriptLinkRepo extends Repository<ScriptLink> {
  public async createAndSave({script, bot, user}: CreateScriptLinkData): Promise<ScriptLink> {
    const link = new ScriptLink();
    link.scriptId = script;
    link.botId = bot;
    link.createdById = user.id;
    const entity = await this.save(link);
    await pubsub.topic('script-updates').publishJSON({
      action: pubsub.scriptUpdateType.Create,
      script: link.scriptId
    }, {
      client: link.botId
    });
    return entity;
  }

  public async restart(link: ScriptLink) {
    await pubsub.topic('script-updates').publishJSON({
      action: pubsub.scriptUpdateType.Restart,
      script: link.scriptId
    }, {
      client: link.botId
    });
  }

  public remove(entities: ScriptLink[]): Promise<ScriptLink[]>;
  public remove(entity: ScriptLink): Promise<ScriptLink>;
  public async remove(entities: ScriptLink | ScriptLink[]): Promise<ScriptLink | ScriptLink[]> {
    entities = Array.isArray(entities) ? entities : [entities]; // Coerce into array
    await Promise.all(entities.map(async (link) => {
      await pubsub.topic('script-updates').publishJSON({
        action: pubsub.scriptUpdateType.Remove,
        script: link.scriptId
      }, {
        client: link.botId
      });
    }));
    return super.remove(entities);
  }
}

export const getScriptLinkRepo = () => getCustomRepository(ScriptLinkRepo);
