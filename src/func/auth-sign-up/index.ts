import { hash } from 'bcryptjs';
import { IsDefined, IsEmail, MinLength } from 'class-validator';

import { Context } from '@azure/functions';
import { User, UserRole } from '@boilerplate/entity';
import { DB, Func, UserFriendlyError } from '@boilerplate/util';

export class SignUpInput {
  @IsDefined()
  @IsEmail()
  emailAddress: string;

  @IsDefined()
  @MinLength(6)
  password: string;
}

export async function signUp(input: SignUpInput) {
  const connection = await DB.getConnection();
  const userRepository = connection.getRepository(User);

  let user = await userRepository.findOne({
    where: {
      emailAddress: input.emailAddress,
    },
  });
  if (user) throw new UserFriendlyError('The emailAddress is occupied.');

  user = new User();
  user.emailAddress = input.emailAddress;
  user.password = await hash(input.password, 12);
  user.roles = [
    UserRole.Users,
  ];

  await userRepository.save(user);
}

export async function authSignUpFunc(context: Context) {
  context.res = await Func.run1(
    context,
    signUp,
    SignUpInput,
  );
}
