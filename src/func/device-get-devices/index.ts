import { Device, DeviceDto, Role } from '@boilerplate/entity';
import { Authorized, DB, Function } from '@boilerplate/util';

class GetDevicesOutput {
  constructor(public devices: DeviceDto[]) { }
}

export async function run(context: any) {
  context.res = await Function.run(
    context,
    async () => {
      const connection = await DB.getConnection();
      const deviceRepository = connection.getRepository(Device);

      const devices = await deviceRepository.find({ relations: ['generalDevice'] });

      return new GetDevicesOutput(devices.map(DeviceDto.from));
    },
    Authorized.permit({
      anyRoles: [Role.Patients, Role.Nurses, Role.Doctors, Role.Instructors],
    }));
}
