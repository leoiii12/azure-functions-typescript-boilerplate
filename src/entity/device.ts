import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { DeviceHistory } from './device-history';
import { GeneralDevice } from './general-device';

@Entity('device')
export class Device {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => GeneralDevice, gd => gd.devices)
  generalDevice: GeneralDevice;

  @OneToMany(type => DeviceHistory, dh => dh.device)
  deviceHistories: DeviceHistory[];

}

export class DeviceDto {

  constructor(
    public id: string,
    public type: string,
    public unit: string) {
  }

  static from(device: Device): DeviceDto {
    return new DeviceDto(device.id, device.generalDevice.type, device.generalDevice.unit);
  }

}
