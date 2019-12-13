import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {User} from './User';
import {Platform, platforms, Runtime, runtimes} from '../../constants';
import {Workspace} from './Workspace';

@Entity('modules')
export class Module {
  @PrimaryColumn('bigint')
  public id!: string;

  @Column()
  public name!: string;

  @Column()
  public body!: string;

  @Column({name: 'deployed_body', nullable: true})
  public deployedBody: string | null;

  @Column({
    type: 'enum',
    enum: platforms
  })
  public platform!: Platform;

  @Column({
    type: 'enum',
    enum: runtimes
  })
  public runtime!: Runtime;

  @ManyToOne((type) => User, (user) => user.workspaces, {lazy: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'workspace_id'})
  public workspace!: Promise<Workspace>;

  @Column({
    name: 'workspace_id',
    type: 'bigint'
  })
  public workspaceId!: string;

  @CreateDateColumn()
  public created!: string;

  @ManyToOne((type) => User, {lazy: true, nullable: true})
  @JoinColumn({name: 'created_by'})
  public createdBy!: Promise<User | null>;

  @Column({
    name: 'created_by',
    type: 'bigint',
    nullable: true
  })
  public createdById!: string | null;

  @UpdateDateColumn({
    nullable: true
  })
  public updated!: Date | null;

  @ManyToOne((type) => User, {lazy: true, nullable: true})
  @JoinColumn({name: 'updated_by'})
  public updatedBy!: Promise<User | null>;

  @Column({
    name: 'updated_by',
    type: 'bigint',
    nullable: true
  })
  public updatedById!: string | null;
}
