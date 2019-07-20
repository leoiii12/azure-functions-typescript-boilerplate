import { IsDefined, IsDivisibleBy, IsInt } from 'class-validator';

import { User, UserListDto, UserRole } from '@boilerplate/entity';
import { Authorized, DB, Func, UnauthorizedError } from '@boilerplate/util';

export class ListUsersInput {
  @IsDefined()
  @IsInt()
  @IsDivisibleBy(20)
  skip: number;
}

export class ListUsersOutput {
  constructor(public users: UserListDto[], public totalNumOfUsers: number) {
  }
}

export async function listUsers(input: ListUsersInput, userId?: string, roles?: UserRole[]): Promise<ListUsersOutput> {
  if (userId === undefined) throw new UnauthorizedError();
  if (roles === undefined) throw new UnauthorizedError();

  const connection = await DB.getConnection();
  const userRepository = connection.getRepository(User);

  const [
    users,
    totalNumOfUsers,
  ] = await userRepository.findAndCount({
    order: {
      createDate: 'ASC',
    },
    take: 20,
    skip: input.skip,
  });

  return new ListUsersOutput(users.map(u => UserListDto.from(u)), totalNumOfUsers);
}

export async function userListUsersFunc(context: any) {
  context.res = await Func.run1(
    context,
    listUsers,
    ListUsersInput,
    Authorized.permit({
      anyRoles: [UserRole.Admins],
    }));
}
