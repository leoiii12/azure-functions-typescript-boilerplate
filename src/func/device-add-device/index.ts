import { transformAndValidate } from 'class-transformer-validator';
import { IsDefined } from 'class-validator';

import { Device, DeviceDto, GeneralDevice, Role } from '@boilerplate/entity';
import { Authorized, DB, Function, UserFriendlyError } from '@boilerplate/util';

class AddDeviceInput {
  @IsDefined()
  generalDeviceId: string;
}

class AddDeviceOutput {
  constructor(public device: DeviceDto) { }
}

export async function run(context: any, req: any) {
  context.res = await Function.run(
    context,
    async () => {
      const input = await transformAndValidate(AddDeviceInput, req.body) as AddDeviceInput;

      const connection = await DB.getConnection();
      const generalDeviceRepository = connection.getRepository(GeneralDevice);

      const generalDevice = await generalDeviceRepository.findOne(input.generalDeviceId);
      if (!generalDevice) throw new UserFriendlyError('The GeneralDevice does not exist');

      let device = new Device();
      device.generalDevice = generalDevice;

      device = await generalDeviceRepository.save(device);

      return new AddDeviceOutput(DeviceDto.from(device));
    },
    Authorized.permit({
      anyRoles: [Role.Nurses],
    }));
}
