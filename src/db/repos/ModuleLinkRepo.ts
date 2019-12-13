import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {ModuleLink, User} from '../entities';
import {pubsub} from '../../pubsub';

export interface CreateModuleLinkData {
  module: string;
  bot: string;
  user: User;
}

@EntityRepository(ModuleLink)
export class ModuleLinkRepo extends Repository<ModuleLink> {
  public async createAndSave({module, bot, user}: CreateModuleLinkData): Promise<ModuleLink> {
    const link = new ModuleLink();
    link.moduleId = module;
    link.botId = bot;
    link.createdById = user.id;
    const entity = await this.save(link);
    await pubsub.topic('script-updates').publishJSON({
      action: pubsub.moduleUpdateType.Create,
      script: link.moduleId
    }, {
      client: link.botId
    });
    return entity;
  }

  public async restart(link: ModuleLink) {
    await pubsub.topic('script-updates').publishJSON({
      action: pubsub.moduleUpdateType.Restart,
      script: link.moduleId
    }, {
      client: link.botId
    });
  }

  public remove(entities: ModuleLink[]): Promise<ModuleLink[]>;
  public remove(entity: ModuleLink): Promise<ModuleLink>;
  public async remove(entities: ModuleLink | ModuleLink[]): Promise<ModuleLink | ModuleLink[]> {
    entities = Array.isArray(entities) ? entities : [entities]; // Coerce into array
    await Promise.all(entities.map(async (link) => {
      await pubsub.topic('script-updates').publishJSON({
        action: pubsub.moduleUpdateType.Remove,
        script: link.moduleId
      }, {
        client: link.botId
      });
    }));
    return super.remove(entities);
  }
}

export const getModuleLinkRepo = () => getCustomRepository(ModuleLinkRepo);
