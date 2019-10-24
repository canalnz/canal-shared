import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {BotState, BotStateName} from '../entities';

export interface BotStateData {
  botId: string;
  state: BotStateName;
  error?: string;
}

@EntityRepository(BotState)
export class BotStateRepo extends Repository<BotState> {
  public async setState({botId, error, state: stateName}: BotStateData): Promise<BotState> {
    let state = await this.findOne({botId});
    if (!state) {
      state = new BotState();
      state.botId = botId;
    }
    state.state = stateName;
    state.errorName = error ? error.substr(0, 256) : null;
    return this.save(state);
  }
}

export const getBotStateRepo = () => getCustomRepository(BotStateRepo);
