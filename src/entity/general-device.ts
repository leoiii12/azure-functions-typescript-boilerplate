import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Device } from './device';

@Entity()
export class GeneralDevice {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  unit: string;

  @OneToMany(type => Device, d => d.generalDevice)
  devices: Device[];

}

export class GeneralDeviceDto {

  constructor(
    public type: string,
    public unit: string) {
  }

  static from(generalDevice: GeneralDevice): GeneralDeviceDto {
    return new GeneralDeviceDto(generalDevice.type, generalDevice.unit);
  }

}
