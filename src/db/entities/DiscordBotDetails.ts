import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import {Bot} from './Bot';

@Entity('discord_bot_details')
export class DiscordBotDetails {
  @OneToOne((type) => Bot, (bot) => bot.discordDetails, {
    lazy: true, onDelete: 'CASCADE'
  })
  @JoinColumn()
  public bot!: Promise<Bot>;

  @PrimaryColumn({name: 'bot_id'})
  public botId!: string;

  @Column()
  public username!: string;

  @Column()
  public discriminator!: string;

  @Column({name: 'discord_id'})
  public discordId!: string;

  @Column()
  public token!: string;
}
