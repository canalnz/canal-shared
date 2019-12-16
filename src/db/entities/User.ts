import {Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryColumn} from 'typeorm';
import {Bot} from './Bot';
import {UserAuthMethod} from './UserAuthMethod';
import {UserSession} from './UserSession';
import {UserFlag} from './UserFlag';
import {Workspace} from './Workspace';
import {buildAvatarUrl} from '../../util/d}iscord';
import {getAuthMethodRepo} from '../repos';

@Entity('users')
export class User {
  @PrimaryColumn('bigint')
  public id!: string;

  @Column()
  public name!: string;

  @Column()
  public email!: string;

  @Column()
  public verified!: boolean;

  @Column({
    name: 'avatar_hash',
    type: 'varchar',
    nullable: true
  })
  public avatarHash!: string | null;

  @CreateDateColumn()
  public created!: Date;

  @Column({
    name: 'last_login',
    type: 'timestamp',
    nullable: true
  })
  public lastLogin!: Date | null;

  @OneToMany((type) => Bot, (bot) => bot.resourceOwner, {lazy: true})
  public bots!: Promise<Bot[]>;

  @ManyToMany((type) => Workspace, {lazy: true})
  public workspaces!: Promise<Workspace[]>;

  @OneToMany((type) => UserAuthMethod, (method) => method.user, {lazy: true})
  public authMethods!: Promise<UserAuthMethod[]>;

  @OneToMany((type) => UserSession, (sess) => sess.user, {lazy: true})
  public sessions!: Promise<UserSession[]>;

  @OneToMany((type) => UserFlag, (flag) => flag.user, {lazy: true})
  public flags!: Promise<UserFlag[]>;

  public async getAvatarUrl(): Promise<string> {
    // TODO REQUIRED fix avatar urls
    const discordAuth = await getAuthMethodRepo().findOneOrFail({userId: this.id, provider: 'DISCORD'});
    return buildAvatarUrl(discordAuth.providerId, this.avatarHash);
  }
}
