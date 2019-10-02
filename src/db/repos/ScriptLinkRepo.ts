import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {ScriptLink, User} from '../entities';
import {ScriptRepository} from './ScriptRepo';
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
    await pubsub.topic('script-update').publishJSON({
      updateType: pubsub.scriptUpdateType.Create
    }, {
      bot: link.botId,
      script: link.scriptId
    });
    return entity;
  }

  public async restart(link: ScriptLink) {
    await pubsub.topic('script-update').publishJSON({
      updateType: pubsub.scriptUpdateType.Restart
    }, {
      bot: link.botId,
      script: link.scriptId
    });
  }

  public remove(entities: ScriptLink[]): Promise<ScriptLink[]>;
  public remove(entity: ScriptLink): Promise<ScriptLink>;
  public async remove(entities: ScriptLink | ScriptLink[]): Promise<ScriptLink | ScriptLink[]> {
    entities = Array.isArray(entities) ? entities : [entities]; // Coerce into array
    await Promise.all(entities.map(async (link) => {
      await pubsub.topic('script-update').publishJSON({
        updateType: pubsub.scriptUpdateType.Remove
      }, {
        bot: link.botId,
        script: link.scriptId
      });
    }));
    return super.remove(entities);
  }
}

export const getScriptLinkRepo = () => getCustomRepository(ScriptLinkRepo);
