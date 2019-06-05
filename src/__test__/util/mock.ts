import { hash } from 'bcryptjs';
import moment from 'moment';
import * as uuid from 'uuid';

import { Role, User } from '@boilerplate/entity';
import { DB } from '@boilerplate/util';

export const users = {
  admin_1: {
    id: uuid.v4(),
    mobilePhone: '88888888',
    password: '123456',
    roles: [Role.Admins],
    enabled: true,
  },
};

export const init = async () => {
  const connection = await DB.getConnection();
  await connection.synchronize();
};

export const createMockAccounts = async () => {
  const connection = await DB.getConnection();
  const userRepository = connection.getRepository(User);

  for (const user of Object.values(users)) {
    const u = new User();
    u.id = user.id;
    u.mobilePhone = user.mobilePhone;
    u.password = await hash(user.password, 12);
    u.roles = user.roles;
    u.tokenVersion = '';
    u.enabled = user.enabled;

    await userRepository.insert(u);
  }
};
