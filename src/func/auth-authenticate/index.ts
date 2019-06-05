import { compare } from 'bcryptjs';
import { IsDefined, IsMobilePhone } from 'class-validator';
import { sign } from 'jsonwebtoken';

import { Context } from '@azure/functions';
import { User } from '@boilerplate/entity';
import { DB, Func, UnauthorizedError, UserFriendlyError } from '@boilerplate/util';

export class AuthenticateInput {
  @IsDefined()
  @IsMobilePhone('en-HK')
  mobilePhone: string;

  @IsDefined()
  password: string;
}

export class AuthenticateOutput {
  constructor(public accessToken: string) {
  }
}

export async function authenticate(input: AuthenticateInput): Promise<AuthenticateOutput> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('Invalid AUTH_SECRET.');

  const connection = await DB.getConnection();
  const userRepository = connection.getRepository(User);

  const user = await userRepository.findOne({
    where: {
      mobilePhone: input.mobilePhone,
    },
  });
  if (!user) throw new UserFriendlyError('Please sign up first.');

  const isValid = await compare(input.password, user.password);
  if (!isValid) throw new UnauthorizedError();

  const options = {
    expiresIn: 60 * 60 * 24 * 31,
    audience: ['http://localhost:7071'],
    issuer: 'http://localhost:7071',
    subject: user.id,
  };

  const payload = {
    role: user.roles,
    gty: 'Auth/Authenticate',
  };

  const token = await sign(payload, secret, options);

  return new AuthenticateOutput(token);
}

export async function authAuthenticateFunc(context: Context) {
  context.res = await Func.run1(
    context,
    authenticate,
    AuthenticateInput,
  );
}
