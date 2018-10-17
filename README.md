# Azure Functions Typescript Boilerplate

## Packages
[typeorm](https://www.npmjs.com/package/typeorm), typescript ORM<br>
[bcrypt](https://www.npmjs.com/package/bcrypt), password encryption<br>
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), JWT token authentication, X-Authorization<br>
[tslint](https://www.npmjs.com/package/tslint)<br>
[parcel-bundler](https://www.npmjs.com/package/parcel-bundler), bundle your functions to decrease the network overheads for faster [cold start](https://blogs.msdn.microsoft.com/appserviceteam/2018/02/07/understanding-serverless-cold-start/)<br>
[class-transformer-validator](https://www.npmjs.com/package/parcel-bundler), validate the models

## Configs
`src/local.settings.json` for `AUTH_SECRET`<br>
`ormconfig.json` for your DB

## Default functions
`src/func/hello-world`, a great start<br>
`src/func/auth-sign-up`, a sign up demos<br>
`src/func/auth-authenticate`, a jwt authenticate demo<br>
`src/func/role-get-roles`, a jwt authorization demo<br>
`src/func/device-get-devices`<br>
`src/func/device-add-device`<br>

## Getting started 

## Hello World
`src/func/role-get-roles`
```javascript
import { Role } from '@boilerplate/entity';
import { Authorized, Function } from '@boilerplate/util';

class GetRolesOutput {
  constructor(public roles: Role[]) { }
}

export async function run(context: any) {
  // 1. Wrap your logic in Function.run
  context.res = await Function.run(
    context,
    async (userId: string, roles: Role[]) => {
      // 2. Your jwt token will be automatically parsed, you can get userId and roles here
      // 3. return your output
      return new GetRolesOutput(roles);
    },
    // 4. You can define the permitted roles to this function 
    Authorized.permit({
      anyRoles: [Role.Patients, Role.Nurses, Role.Doctors, Role.Instructors],
    }));
}
```

`src/func/device-add-device`
```javascript
import { transformAndValidate } from 'class-transformer-validator';
import { IsDefined } from 'class-validator';

import { Device, DeviceDto, GeneralDevice, Role } from '@boilerplate/entity';
import { Authorized, DB, Function, UserFriendlyError } from '@boilerplate/util';

// 5. Input
class AddDeviceInput {
  @IsDefined()
  generalDeviceId: string;
}

// 6. Output
class AddDeviceOutput {
  constructor(public device: DeviceDto) { }
}

export async function run(context: any, req: any) {
  context.res = await Function.run(
    context,
    async () => {
      // 7. Validate your model
      const input = await transformAndValidate(AddDeviceInput, req.body) as AddDeviceInput;

      // 8. Get a DB connection with TypeORM
      const connection = await DB.getConnection();
      const generalDeviceRepository = connection.getRepository(GeneralDevice);

      const generalDevice = await generalDeviceRepository.findOne(input.generalDeviceId);
      if (!generalDevice) throw new UserFriendlyError('The GeneralDevice does not exist');
      // 9. throw a UserFriendlyError

      // 10. Create a new entity object
      let device = new Device();
      device.generalDevice = generalDevice;

      device = await generalDeviceRepository.save(device);

      // 11. Return deviceDto with AddDeviceOutput
      return new AddDeviceOutput(DeviceDto.from(device));
    },
    Authorized.permit({
      anyRoles: [Role.Nurses],
    }));
}
```
