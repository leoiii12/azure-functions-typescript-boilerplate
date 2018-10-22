import { hash } from 'bcryptjs';
import { IsDefined, IsMobilePhone } from 'class-validator';

import { User } from '@boilerplate/entity';
import { DB, Func, UserFriendlyError } from '@boilerplate/util';

export class SignUpInput {
  @IsDefined()
  @IsMobilePhone('en-HK')
  mobilePhone: string;

  @IsDefined()
  password: string;
}

export async function signUp(input: SignUpInput) {
  const connection = await DB.getConnection();
  const userRepository = connection.getRepository(User);

  let user = await userRepository.findOne({
    where: {
      mobilePhone: input.mobilePhone,
    },
  });
  if (user) throw new UserFriendlyError('The mobilePhone is occupied.');

  user = new User();
  user.mobilePhone = input.mobilePhone;
  user.password = await hash(input.password, 12);
  user.roles = [];

  await userRepository.insert(user);
}

export async function run(context: any, req: any) {
  context.res = await Func.run1(
    context,
    signUp,
    SignUpInput,
  );
}
