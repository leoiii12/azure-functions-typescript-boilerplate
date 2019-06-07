import { Context } from '@azure/functions';
import { Role } from '@boilerplate/entity';
import { Authorized, Func, InternalServerError } from '@boilerplate/util';

export class GetRolesOutput {
  constructor(public roles: Role[]) {
  }
}

export async function getRoles(_: any, roles?: Role[]): Promise<GetRolesOutput> {
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
