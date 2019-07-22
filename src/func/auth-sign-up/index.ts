import { hash } from 'bcryptjs';
import { IsDefined, IsMobilePhone, MinLength, IsEmail, IsOptional, IsPhoneNumber, IsAlphanumeric, IsAlpha } from 'class-validator';
import { Context } from '@azure/functions';
import { User, Role, UserDto } from '@boilerplate/entity';
import { DB, Func, UserFriendlyError, InternalServerError, OperationID } from '@boilerplate/util';

export class SignUpInput {

  @IsDefined()
  @MinLength(6)
  password: string;

  @IsDefined()
  @IsAlpha()
  fn: string;

  @IsDefined()
  @IsAlpha()
  ln: string;

  @IsOptional()
  brandName ?: string;

  @IsDefined()
  @IsEmail()
  workEmail: string;

  @IsOptional()
  businessName?: string;

  @IsOptional()
  @IsPhoneNumber('ZZ')
  phone?: string;

}
export class SingleUserOutput {
  constructor(public user: UserDto) {
  }
}

export async function signUp(input: SignUpInput) {
  try {
    const connection = await DB.getConnection();
    const userRepository = connection.getRepository(User);

    let user = await userRepository.findOne({
      where: {
        workEmail: input.workEmail,
      },
    });
    if (user) throw new UserFriendlyError('The Email is occupied.');

    user = new User();
    user.phone = input.phone || null;
    user.password = await hash(input.password, 12);
    user.roles = [Role.Users, Role.Admins];
    user.brandName = input.brandName || null;
    user.enabled = true;
    user.businessName = input.businessName || null;
    user.fn = input.fn;
    user.ln = input.ln;
    user.workEmail = input.workEmail;

    await userRepository.save(user);
    return new SingleUserOutput(UserDto.from(user));
  } catch (err) {
    throw new InternalServerError(` - Sign UP Function in ${__filename} - ${err.toString()}`);
  }
}

export async function authSignUpFunc(context: Context) {
  context.res = await Func.runWithInput(
    context,
    signUp,
    SignUpInput,
    OperationID.INSERT,
  );
}
