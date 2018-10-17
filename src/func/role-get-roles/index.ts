import { Role } from '@boilerplate/entity';
import { Authorized, Function } from '@boilerplate/util';

class GetRolesOutput {
  constructor(public roles: Role[]) { }
}

export async function run(context: any) {
  context.res = await Function.run(
    context,
    async (_: string, roles: Role[]) => {
      return new GetRolesOutput(roles);
    },
    Authorized.permit({
      anyRoles: [Role.Patients, Role.Nurses, Role.Doctors, Role.Instructors],
    }));
}
