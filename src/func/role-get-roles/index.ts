import { Context } from '@azure/functions';
import { UserRole } from '@boilerplate/entity';
import { Authorized, Func, InternalServerError } from '@boilerplate/util';

export class GetRolesOutput {
  constructor(public roles: UserRole[]) {
  }
}

export async function getRoles(_: any, roles?: UserRole[]): Promise<GetRolesOutput> {
  if (roles) return new GetRolesOutput(roles);

  throw new InternalServerError();
}

export async function getRolesFunc(context: Context) {
  context.res = await Func.run0(
    context,
    getRoles,
    Authorized.permit({
    }));
}
