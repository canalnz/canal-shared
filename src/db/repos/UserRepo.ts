import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {User} from '../entities';
import {nextSnowflake} from '../../util/snowflake';
import {getSessRepo} from './UserSessionRepo';

export interface NewUserData {
  name: string;
  email: string;
  avatarHash?: string;
  verified?: boolean;
}

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async createAndSave({name, email, avatarHash, verified = false}: NewUserData): Promise<User> {
    const user = new User();
    user.id = await nextSnowflake();
    user.name = name;
    user.email = email;
    user.avatarHash = avatarHash || null;
    user.verified = verified;

    return this.save(user);
  }
  public async getByToken(token: string): Promise<User | null> {
    const sess = await getSessRepo().findOne({token});
    if (!sess) return null;
    return await this.findOne({id: sess.userId}) || null;
  }
  // Let's just hope this works
  // public delete(...args: any[]): never {
  //   throw new Error('User delete is not implemented yet!');
  // }
}

export const getUserRepo = () => getCustomRepository(UserRepository);
