import { hash } from 'bcryptjs';
import { verify } from 'jsonwebtoken';

import { User } from '@boilerplate/entity';
import { DB, UnauthorizedError, UserFriendlyError } from '@boilerplate/util';

import { authenticate, AuthenticateInput } from '../../func/auth-authenticate';

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

describe('authenticate', () => {

  it('should work when correct password', async () => {
    const input = new AuthenticateInput();
    input.mobilePhone = mobilePhone;
    input.password = password;

    const output = await authenticate(input);
    expect(output).toBeDefined();

    const connection = await DB.getConnection();
    const userRepository = connection.getRepository(User);

    const count = await userRepository.count();
    expect(count).toBe(1);

    const user = await userRepository.findOneOrFail();
    const decoded = await verify(output.accessToken, process.env.AUTH_SECRET as string) as any;
    expect(decoded.sub).toBe(user.id);
  });

  it('should error when incorrect password', async () => {
    const input = new AuthenticateInput();
    input.mobilePhone = mobilePhone;
    input.password = 'incorrect';

    await expect(authenticate(input)).rejects.toThrowError(UnauthorizedError);
  });

  it('should error when incorrect password', async () => {
    const input = new AuthenticateInput();
    input.mobilePhone = mobilePhone;

    // tslint:disable-next-line:max-line-length
    input.password = 'incorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrectincorrect';

    await expect(authenticate(input)).rejects.toThrowError(UnauthorizedError);
  });

  it('should error when no sign up', async () => {
    const input = new AuthenticateInput();
    input.mobilePhone = 'incorrect';
    input.password = 'incorrect';

    await expect(authenticate(input)).rejects.toThrowError(UserFriendlyError);
  });

  it('should not work when empty input', async () => {
    const input = new AuthenticateInput();

    await expect(authenticate(input)).rejects.toThrowError(UserFriendlyError);
  });

});
