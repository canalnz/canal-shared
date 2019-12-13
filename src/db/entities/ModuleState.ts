import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {Bot} from './Bot';
import {Module} from './Module';
import {ModuleLink} from './ModuleLink';
import {getModuleLinkRepo} from '../repos';

export type ModuleStateName = 'STOPPED' | 'RUNNING' | 'PASSIVE' | 'ERROR';
export const moduleStateNames = ['STOPPED', 'RUNNING', 'PASSIVE', 'ERROR'];

@Entity('module_states')
export class ModuleState {
  @ManyToOne((type) => Bot, {lazy: true, primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'bot_id'})
  public bot!: Promise<Bot>;

  @PrimaryColumn({name: 'bot_id', type: 'bigint'})
  public botId!: string;

  @ManyToOne((type) => Module, {lazy: true, primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'module_id'})
  public module!: Promise<Module>;

  @PrimaryColumn({name: 'module_id', type: 'bigint'})
  public moduleId!: string;

  @UpdateDateColumn()
  public updated!: Date;

  @Column({
    type: 'enum',
    enum: moduleStateNames
  })
  public state!: ModuleStateName;

  private _link: ModuleLink | null = null;
  public async link(): Promise<ModuleLink> {
    if (!this._link) {
      this._link = await getModuleLinkRepo().findOneOrFail({moduleId: this.moduleId, botId: this.botId});
    }
    return this._link;
  }
}
