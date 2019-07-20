import { signUp, SignUpInput } from '@boilerplate/func';
import { UserFriendlyError } from '@boilerplate/util';

import { createMockUsers, init, users } from '../entity';

beforeAll(async (done) => {
  await init();
  await createMockUsers();

  done();
});

describe('auth-sign-up', () => {

  it('should not work', async () => {
    const user = users.admin_1;

    const input = new SignUpInput();
    input.emailAddress = user.emailAddress;
    input.password = 'incorrect';

    await expect(signUp(input)).rejects.toThrowError(UserFriendlyError);
  });

});
