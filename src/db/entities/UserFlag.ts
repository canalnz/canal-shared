import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {User} from './User';

@Entity('user_flags')
export class UserFlag {
    @ManyToOne((type) => User, (user) => user.flags, {lazy: true, primary: true})
    @JoinColumn({name: 'user_id'})
    public user!: Promise<User>;

    @PrimaryColumn({name: 'user_id', type: 'bigint'})
    public userId!: string;

    @PrimaryColumn()
    public name!: string;

    @Column()
    public value!: string;
}
