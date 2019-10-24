import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {Bot} from './Bot';
import {Script} from './Script';
import {ScriptLink} from './ScriptLink';
import {getScriptLinkRepo} from '../repos';

export type ScriptStateName = 'STOPPED' | 'RUNNING' | 'PASSIVE' | 'ERROR';
export const scriptStateNames = ['STOPPED', 'RUNNING', 'PASSIVE', 'ERROR'];

@Entity('script_states')
export class ScriptState {
  @ManyToOne((type) => Bot, {lazy: true, primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'bot_id'})
  public bot!: Promise<Bot>;

  @PrimaryColumn({name: 'bot_id', type: 'bigint'})
  public botId!: string;

  @ManyToOne((type) => Script, {lazy: true, primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'script_id'})
  public script!: Promise<Script>;

  @PrimaryColumn({name: 'script_id', type: 'bigint'})
  public scriptId!: string;

  @UpdateDateColumn()
  public updated!: Date;

  @Column({
    type: 'enum',
    enum: scriptStateNames
  })
  public state!: ScriptStateName;

  private _link: ScriptLink | null = null;
  public async link(): Promise<ScriptLink> {
    if (!this._link) {
      this._link = await getScriptLinkRepo().findOneOrFail({scriptId: this.scriptId, botId: this.botId});
    }
    return this._link;
  }
}
