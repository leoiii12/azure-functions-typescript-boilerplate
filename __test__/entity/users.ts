import { v4 } from 'uuid';

import { UserRole } from '@boilerplate/entity';

export const users = {
  admin_1: {
    id: v4(),
    emailAddress: '80000000@hktv.com.hk',
    password: '123456',
    roles: [UserRole.Admins, UserRole.Users],
    enabled: true,
  },
  user_1: {
    id: v4(),
    emailAddress: '80000001@hktv.com.hk',
    password: '123456',
    roles: [UserRole.Users],
    enabled: true,
  },
};
