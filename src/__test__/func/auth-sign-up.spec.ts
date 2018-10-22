import { hash } from 'bcryptjs';

import { User } from '@boilerplate/entity';
import { DB, UserFriendlyError } from '@boilerplate/util';

import { signUp, SignUpInput } from '../../func/auth-sign-up';

const mobilePhone = '61096623';
const password = '123';

beforeAll(async (done) => {
  const connection = await DB.getConnection();
  await connection.synchronize();

  const userRepository = connection.getRepository(User);

  const user = new User();
  user.mobilePhone = mobilePhone;
  user.password = await hash(password, 12);
  user.roles = [];

  await userRepository.insert(user);

  done();
});

describe('signUp', () => {

  it('should work', async () => {
    const input = new SignUpInput();
    input.mobilePhone = mobilePhone;
    input.password = 'incorrect';

    await expect(signUp(input)).rejects.toThrowError(UserFriendlyError);
  });

});
