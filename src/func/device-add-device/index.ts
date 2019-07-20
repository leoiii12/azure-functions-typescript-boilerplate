import { IsDefined } from 'class-validator';

import { Context } from '@azure/functions';
import { Device, DeviceDto, GeneralDevice, UserRole } from '@boilerplate/entity';
import { Authorized, DB, Func, UserFriendlyError } from '@boilerplate/util';

export class AddDeviceInput {
  @IsDefined()
  generalDeviceId: string;
}

export class AddDeviceOutput {
  constructor(public device: DeviceDto) {
  }
}

export async function addDevice(input: AddDeviceInput): Promise<AddDeviceOutput> {
  const connection = await DB.getConnection();
  const generalDeviceRepository = connection.getRepository(GeneralDevice);

  const generalDevice = await generalDeviceRepository.findOne(input.generalDeviceId);
  if (!generalDevice) throw new UserFriendlyError('The GeneralDevice does not exist');

  let device = new Device();
  device.generalDevice = generalDevice;

  device = await generalDeviceRepository.save(device);

  return new AddDeviceOutput(DeviceDto.from(device));
}

export async function deviceAddDeviceFunc(context: Context) {
  context.res = await Func.run1(
    context,
    addDevice,
    AddDeviceInput,
    Authorized.permit({
      anyRoles: [UserRole.Admins],
    }),
  );
}
