import {getRepository} from 'typeorm';
import {DiscordBotDetails} from '../entities';

export const getDiscordDetailsRepo = () => getRepository(DiscordBotDetails);
