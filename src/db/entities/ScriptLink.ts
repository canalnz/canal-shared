import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {Bot} from './Bot';
import {Script} from './Script';
import {User} from './User';
import {ScriptState} from './ScriptState';
import {getScriptStateRepo} from '../repos';

@Entity('script_links')
export class ScriptLink {
  @ManyToOne((type) => Bot, (bot) => bot.scripts, {lazy: true, primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'bot_id'})
  public bot!: Promise<Bot>;

  @PrimaryColumn({name: 'bot_id', type: 'bigint'})
  public botId!: string;

  @ManyToOne((type) => Script, {lazy: true, primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'script_id'})
  public script!: Promise<Script>;

  @PrimaryColumn({name: 'script_id', type: 'bigint'})
  public scriptId!: string;

  @Column({name: 'last_started', type: 'timestamp', nullable: true})
  public lastStarted!: Date | null;

  @CreateDateColumn()
  public created!: Date;

  @ManyToOne((type) => User, {lazy: true, nullable: true})
  @JoinColumn({name: 'created_by'})
  public createdBy!: Promise<string | null>;

  @Column({name: 'created_by', nullable: true, type: 'bigint'})
  public createdById!: string | null;

  private _state: ScriptState | null = null;
  public async state(): Promise<ScriptState> {
    if (!this._state) {
      this._state = await getScriptStateRepo().findOneOrFail({scriptId: this.scriptId, botId: this.botId});
    }
    return this._state;
  }
}
