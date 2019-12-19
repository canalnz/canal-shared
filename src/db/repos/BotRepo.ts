import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {Bot, DiscordBotDetails, User} from '../entities';
import {getSelf} from '../../util/discord';
import {nextSnowflake} from '../../util/snowflake';
import {Platform} from '../../constants';
import {getDiscordDetailsRepo} from './DiscordBotDetailsRepo';

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

    const discordBotDetails = new DiscordBotDetails();
    discordBotDetails.botId = bot.id;
    discordBotDetails.discordId = botData.id;
    discordBotDetails.username = botData.username;
    discordBotDetails.discriminator = botData.discriminator;
    discordBotDetails.token = token;

    bot.discordDetails = discordBotDetails;

    const b = await this.save(bot); // We need to do it in this order, because discord_bot_details depends upon bot
    await getDiscordDetailsRepo().save(discordBotDetails);

    return b;
  }
  public async updateBotToken(bot: Bot, newToken: string): Promise<Bot> {
    const botData = await getSelf(newToken, true); // Will throw if not valid
    const details = bot.discordDetails;

    details.token = newToken;
    details.discordId = botData.id;
    details.username = botData.username;
    details.discriminator = botData.discriminator;
    await getDiscordDetailsRepo().save(details);

    bot.avatarHash = botData.avatar;
    bot.name = botData.username;
    return await this.save(bot);

  }
}

export const getBotRepo = () => getCustomRepository(BotRepository);
