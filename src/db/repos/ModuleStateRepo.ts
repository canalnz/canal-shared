import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {ModuleState, ModuleStateName} from '../entities';

export interface ModuleStateData {
  moduleId: string;
  botId: string;
  state: ModuleStateName;
}

@EntityRepository(ModuleState)
export class ModuleStateRepo extends Repository<ModuleState> {
  public async setState({moduleId, botId, state: stateName}: ModuleStateData): Promise<ModuleState> {
    let state = await this.findOne({moduleId, botId});
    if (!state) {
      state = new ModuleState();
      state.moduleId = moduleId;
      state.botId = botId;
    }
    state.state = stateName;
    return this.save(state);
  }
}

export const getModuleStateRepo = () => getCustomRepository(ModuleStateRepo);
