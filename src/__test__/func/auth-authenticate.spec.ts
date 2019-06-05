import { verify } from 'jsonwebtoken';

import { User } from '@boilerplate/entity';
import { authenticate, AuthenticateInput } from '@boilerplate/func';
import { DB, UnauthorizedError, UserFriendlyError } from '@boilerplate/util';

import { createMockAccounts, init, users } from '../util/mock';

beforeAll(async (done) => {
  await init();
  await createMockAccounts();

  done();
});

describe('auth-authenticate', () => {

  it('should work when correct password with mobilePhone', async () => {
    const input = new AuthenticateInput();
    input.mobilePhone = users.admin_1.mobilePhone;
    input.password = users.admin_1.password;

    const output = await authenticate(input);
    expect(output).toBeDefined();

    const connection = await DB.getConnection();
    const userRepository = connection.getRepository(User);

    const count = await userRepository.count();
    expect(count).toBe(Object.keys(users).length);

    const user = await userRepository.findOneOrFail();
    const decoded = await verify(output.accessToken, process.env.AUTH_SECRET as string) as any;
    expect(decoded.sub).toBe(user.id.toString());
  });

  it('should error when incorrect password', async () => {
    const input = new AuthenticateInput();
    input.mobilePhone = users.admin_1.mobilePhone;
    input.password = 'incorrect';

    await expect(authenticate(input)).rejects.toThrowError(UnauthorizedError);
  });

  it('should error when incorrect password', async () => {
    const input = new AuthenticateInput();
    input.mobilePhone = users.admin_1.mobilePhone;

    // tslint:disable-next-line:max-line-length
    input.password = 'incorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrect';

    await expect(authenticate(input)).rejects.toThrowError(UnauthorizedError);
  });

  it('should error when no sign up', async () => {
    const input = new AuthenticateInput();
    input.mobilePhone = 'A000000';
    input.password = 'incorrect';

    await expect(authenticate(input)).rejects.toThrowError(UserFriendlyError);
  });

  it('should not work when empty input', async () => {
    const input = new AuthenticateInput();

    await expect(authenticate(input)).rejects.toThrowError(UserFriendlyError);
  });

});
