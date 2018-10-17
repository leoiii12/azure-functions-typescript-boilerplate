import { hash } from 'bcryptjs';
import { transformAndValidate } from 'class-transformer-validator';
import { IsDefined, IsMobilePhone } from 'class-validator';

import { User } from '@boilerplate/entity';
import { DB, Function, UserFriendlyError } from '@boilerplate/util';

class SignUpInput {
  @IsDefined()
  @IsMobilePhone('en-HK')
  mobilePhone: string;

  @IsDefined()
  password: string;
}

export async function run(context: any, req: any) {
  context.res = await Function.run(
    context,
    async () => {
      const input = await transformAndValidate(SignUpInput, req.body) as SignUpInput;

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

      await userRepository.insert(user);
    });
}
