import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {Bot} from './Bot';

export type BotStateName = 'OFFLINE' | 'FAILED' | 'STARTUP' | 'ONLINE' | 'ERROR';
export const botStateNames = ['OFFLINE', 'FAILED', 'STARTUP', 'ONLINE', 'ERROR'];

@Entity('bot_states')
export class BotState {
  @OneToOne((type) => Bot, (bot) => bot.state, {lazy: true, primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'bot_id'})
  public bot!: Promise<Bot>;

  @PrimaryColumn({name: 'bot_id', type: 'bigint'})
  public botId!: string;

  @UpdateDateColumn()
  public updated!: Date;

  @Column({type: 'enum', enum: botStateNames})
  public state!: BotStateName;

  @Column({name: 'error_name', type: 'varchar', nullable: true})
  public errorName!: string | null;
}
