import { hash } from 'bcryptjs';

import { User } from '@boilerplate/entity';
import { DB } from '@boilerplate/util';

import { users } from './users';

export const init = async () => {
  const connection = await DB.getConnection();
  await connection.synchronize();
};

export const createMockUsers = async () => {
  const connection = await DB.getConnection();
  const userRepository = connection.getRepository(User);

  for (const user of Object.values(users)) {
    const u = new User();
    u.id = user.id;
    u.emailAddress = user.emailAddress;
    u.password = await hash(user.password, 12);
    u.roles = user.roles;
    u.tokenVersion = '';
    u.enabled = user.enabled;
    await userRepository.insert(u);
  }
};
