import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {User} from './User';

@Entity('Workspace')
export class Workspace {
  @PrimaryColumn('bigint')
  public id!: string;

  @Column()
  public name!: string;

  @ManyToOne((type) => User, (user) => user.workspaces, {lazy: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'resource_owner'})
  public resourceOwner!: Promise<User>;

  @Column({name: 'resource_owner'})
  public resourceOwnerId!: string;

  // Not necessarily an inverse side: creator could be removed
  @ManyToOne((type) => User, {lazy: true, nullable: true})
  @JoinColumn({name: 'created_by'})
  public createdBy!: Promise<User | null>;

  @Column({
    name: 'created_by',
    type: 'bigint',
    nullable: true
  })
  public createdById!: string | null;

  @Column({name: 'is_personal'})
  public isPersonal!: boolean;
}
