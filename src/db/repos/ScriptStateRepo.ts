import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {ScriptState, ScriptStateName} from '../entities';

export interface ScriptStateData {
  scriptId: string;
  botId: string;
  state: ScriptStateName;
}

@EntityRepository(ScriptState)
export class ScriptStateRepo extends Repository<ScriptState> {
  public async setState({scriptId, botId, state: stateName}: ScriptStateData): Promise<ScriptState> {
    let state = await this.findOne({scriptId, botId});
    if (!state) {
      state = new ScriptState();
      state.scriptId = scriptId;
      state.botId = botId;
    }
    state.state = stateName;
    return this.save(state);
  }
}

export const getScriptStateRepo = () => getCustomRepository(ScriptStateRepo);
