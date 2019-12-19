import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {Bot} from './Bot';
import {Module} from './Module';
import {User} from './User';
import {ModuleState} from './ModuleState';
import {getModuleStateRepo} from '../repos';

@Entity('module_links')
export class ModuleLink {
  @ManyToOne((type) => Bot, (bot) => bot.modules, {lazy: true, primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'bot_id'})
  public bot!: Promise<Bot>;

  @PrimaryColumn({name: 'bot_id', type: 'bigint'})
  public botId!: string;

  @ManyToOne((type) => Module, {lazy: true, primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'module_id'})
  public module!: Promise<Module>;

  @PrimaryColumn({name: 'module_id', type: 'bigint'})
  public moduleId!: string;

  @CreateDateColumn()
  public created!: Date;

  @ManyToOne((type) => User, {lazy: true, nullable: true})
  @JoinColumn({name: 'created_by'})
  public createdBy!: Promise<string | null>;

  @Column({name: 'created_by', nullable: true, type: 'bigint'})
  public createdById!: string | null;

  private _state: ModuleState | null = null;
  public async state(): Promise<ModuleState> {
    if (!this._state) {
      this._state = await getModuleStateRepo().findOneOrFail({moduleId: this.moduleId, botId: this.botId});
    }
    return this._state;
  }
}
