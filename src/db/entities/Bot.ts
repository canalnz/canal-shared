import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import {User} from './User';
import {ModuleLink} from './ModuleLink';
import {Platform, platforms} from '../../constants';
import {DiscordBotDetails} from './DiscordBotDetails';

@Entity('bots')
export class Bot {
  @PrimaryColumn('bigint')
  public id!: string;

  @Column({length : 128})
  public name!: string;

  @Column({
    name: 'avatar_hash',
    type: 'varchar',
    length: 64,
    nullable: true
  })
  public avatarHash!: string | null;

  @Column({
    type: 'enum',
    enum: platforms
  })
  public platform!: Platform;

  @ManyToOne((type) => User, (user) => user.bots, {lazy: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'resource_owner'})
  public resourceOwner!: Promise<User>;

  @Column({name: 'resource_owner', type: 'bigint'})
  public resourceOwnerId!: string;

  @CreateDateColumn()
  public created!: string;

  @ManyToOne((type) => User, {lazy: true, nullable: true})
  @JoinColumn({name: 'created_by'})
  public createdBy!: Promise<string | null>;

  @Column({name: 'created_by', type: 'bigint', nullable: true})
  public createdById!: string | null;

  @UpdateDateColumn({
    nullable: true
  })
  public updated!: Date | null;

  @ManyToOne((type) => User, {lazy: true, nullable: true})
  @JoinColumn({name: 'updated_by'})
  public updatedBy!: Promise<string | null>;

  @Column({name: 'updated_by', type: 'bigint', nullable: true})
  public updatedById!: string | null;

  @OneToMany((type) => ModuleLink, (link) => link.bot, {lazy: true})
  public modules!: Promise<ModuleLink[]>;

  @OneToOne((type) => DiscordBotDetails, (details) => details.bot, {lazy: true, onDelete: 'SET NULL'})
  public discordDetails!: Promise<DiscordBotDetails>;

  public async getAvatarUrl(): Promise<string> {
    // TODO REQUIRED fix avatar urls
    return '';
  }
}
