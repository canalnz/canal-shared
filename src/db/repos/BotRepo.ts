import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {Bot, User} from '../entities';
import {getSelf} from '../../util/discord';
import {nextSnowflake} from '../../util/snowflake';
import {Platform} from '../../constants';

export interface CreateBotData {
  token: string;
  platform: Platform;
  owner: User;
}

@EntityRepository(Bot)
export class BotRepository extends Repository<Bot> {
  public async findOneIfUserCanRead(id: string, user: User): Promise<Bot | null> {
    // It's only going to find it if it both exists *and* is owned by the user
    // Basically 404s rather than 403ing when perms aren't ok
    return await this.findOne({id, resourceOwnerId: user.id}) || null;
  }
  public async createAndSave({platform, token, owner}: CreateBotData): Promise<Bot> {
    const botData = await getSelf(token, true);
    if (!botData || !botData.id) throw new Error('That token doesn\'t appear to be valid');
    if (!botData.bot) throw new Error('Automating user accounts is against Discord ToS, and is prohibited');

    const bot = new Bot();
    bot.id = await nextSnowflake();
    bot.platform = platform;
    bot.resourceOwnerId = owner.id;
    bot.createdById = owner.id;

    bot.name = botData.username;
    bot.avatarHash = botData.avatar;

    return this.save(bot);
  }
}

export const getBotRepo = () => getCustomRepository(BotRepository);
