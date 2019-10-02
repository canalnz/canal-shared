import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {Bot, BotPermission} from '../entities';
import {nextSnowflake} from '../../util/snowflake';

export interface BotPermissionCreateData {
  bot: Bot;
  name: string;
}

@EntityRepository(BotPermission)
export class BotPermissionRepo extends Repository<BotPermission> {
  public async createAndSave({bot, name}: BotPermissionCreateData): Promise<BotPermission> {
    const perm = new BotPermission();
    perm.id = await nextSnowflake();
    perm.botId = bot.id;
    perm.name = bot.name;
    return this.save(perm);
  }
}

export const getBotPermRepo = () => getCustomRepository(BotPermissionRepo);
