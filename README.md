# Azure Functions Typescript Boilerplate

This project helps set up so many things that I encountered when developing projects with Azure Functions + TypeScript.

## Packages
[typeorm](https://www.npmjs.com/package/typeorm), typescript ORM<br>
[bcrypt](https://www.npmjs.com/package/bcrypt), password encryption<br>
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), JWT token authentication, `X-Authorization: Bearer <your-token>`<br>
[tslint](https://www.npmjs.com/package/tslint)<br>
[parcel-bundler](https://www.npmjs.com/package/parcel-bundler), bundle your functions to decrease the network overheads for faster [cold start](https://blogs.msdn.microsoft.com/appserviceteam/2018/02/07/understanding-serverless-cold-start/)<br>
[class-transformer-validator](https://www.npmjs.com/package/parcel-bundler), transform JSON into TS objects and validate them<br>
[jest](https://www.npmjs.com/package/jest), testing<br>
[swagger](https://swagger.io) + [ts-morph](https://www.npmjs.com/package/ts-morph), automatically generate the swagger document `doc/versions/staging.json`<br>
[dotenv](https://www.npmjs.com/package/dotenv), `.env`<br>

## Configs
`src/local.settings.json` for `AUTH_SECRET`<br>
`ormconfig.json` for your DB

## Default functions
`src/func/init`, a great start to initialize the admin account<br>
`src/func/hello-world`, a great start<br>
`src/func/auth-sign-up`, a sign up demos<br>
`src/func/auth-authenticate`, a jwt authenticate demo<br>
`src/func/role-get-roles`, a jwt authorization demo<br>
`src/func/device-get-devices`<br>
`src/func/device-add-device`<br>
`src/func/swagger-doc`, a HTML endpoint to see the generated swagger doc<br>

```bash
npm run typeorm:cli -- migration:generate -c dev -n Init
npm run typeorm:cli -- migration:run -c dev
npm run typeorm:cli -- migration:revert -c dev
```

## Hello World
`src/func/role-get-roles`
```javascript
import { Context } from '@azure/functions';
import { Role } from '@boilerplate/entity';
import { Authorized, Func, InternalServerError } from '@boilerplate/util';

export class GetRolesOutput {
  constructor(public roles: Role[]) {
  }
}

export async function getRoles(_: any, roles?: Role[]): Promise<GetRolesOutput> {
  // 3. Your jwt token will be automatically parsed, you can get userId and roles here
  // 4. return your output
  if (roles) return new GetRolesOutput(roles);

  throw new InternalServerError();
}

// 5. The entry function must end with `Func` or the swagger doc generator cannot find the entry point
export async function getRolesFunc(context: Context) {
  // 1. Wrap your logic in Function.run
  context.res = await Func.run0(
    context,
    getRoles,
    // 2. You can define the permitted roles to this function 
    Authorized.permit({
      anyRoles: [Role.Patients, Role.Nurses, Role.Doctors, Role.Instructors],
    }));
}
```

`src/func/device-add-device`
```javascript
import { IsDefined } from 'class-validator';

import { Context } from '@azure/functions';
import { Device, DeviceDto, GeneralDevice, Role } from '@boilerplate/entity';
import { Authorized, DB, Func, UserFriendlyError } from '@boilerplate/util';

// 6. Input
export class AddDeviceInput {
  @IsDefined()
  generalDeviceId: string;
}

// 7. Output
export class AddDeviceOutput {
  constructor(public device: DeviceDto) {
  }
}

// 8. The input JSON is automatically parsed
export async function addDevice(input: AddDeviceInput): Promise<AddDeviceOutput> {
  // 9. Get a DB connection with TypeORM
  const connection = await DB.getConnection();
  const generalDeviceRepository = connection.getRepository(GeneralDevice);

  // 10. API clients will see your exception message defined here 
  const generalDevice = await generalDeviceRepository.findOne(input.generalDeviceId);
  if (!generalDevice) throw new UserFriendlyError('The GeneralDevice does not exist');

  // 11. Create a new instance
  let device = new Device();
  device.generalDevice = generalDevice;

  device = await generalDeviceRepository.save(device);

  // 12. Return deviceDto with AddDeviceOutput
  return new AddDeviceOutput(DeviceDto.from(device));
}

export async function deviceAddDeviceFunc(context: Context) {
  context.res = await Func.run1(
    context,
    addDevice,
    // The input type
    AddDeviceInput,
    Authorized.permit({
      anyRoles: [Role.Nurses],
    }),
  );
}
