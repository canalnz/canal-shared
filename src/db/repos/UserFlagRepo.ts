import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {User, UserFlag} from '../entities';

interface FlagCreateData {
    user: User | string;
    name: string;
    value?: string;
}

function id(user: User | string): string {
    return typeof user === 'string' ? user : user.id;
}

@EntityRepository(UserFlag)
export class UserFlagRepo extends Repository<UserFlag> {
    public async createAndSave({user, name, value = 'true'}: FlagCreateData) {
        const flag = new UserFlag();
        flag.userId = id(user);
        flag.name = name;
        flag.value = value;
        return this.save(flag);
    }

    public async isUserAdmin(user: User | string): Promise<boolean> {
        return !!await this.findOne({userId: id(user), name: 'isAdmin'});
    }
}

export const getUserFlagRepo = () => getCustomRepository(UserFlagRepo);
