import { hash } from 'bcryptjs';
import { IsDefined, IsEmail } from 'class-validator';

import { User, UserRole } from '@boilerplate/entity';
import { DB, Func, UnauthorizedError } from '@boilerplate/util';

export class InitInput {
  @IsDefined()
  @IsEmail()
  emailAddress: string;

  @IsDefined()
  password: string;
}

export async function init(input: InitInput) {
  const connection = await DB.getConnection();
  const userRepository = connection.getRepository(User);

  if (await userRepository.count() > 0) {
    throw new UnauthorizedError();
  }

  const newUser = new User();
  newUser.emailAddress = input.emailAddress;
  newUser.password = await hash(input.password, 12);
  newUser.roles = [
    UserRole.Admins,
    UserRole.Users,
  ];
  await userRepository.save(newUser);
}

export async function initFunc(context: any) {
  context.res = await Func.run1(
    context,
    init,
    InitInput,
  );
}
