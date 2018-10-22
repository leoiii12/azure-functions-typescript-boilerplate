import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Device } from './device';
import { User } from './user';

@Entity('device_history')
export class DeviceHistory {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Device, d => d.deviceHistories)
  device: Device;

  @Column()
  userId: string;

  @ManyToOne(type => User, d => d.deviceHistories)
  user: User;

  @Column()
  start: Date;

  @Column()
  end: Date;

}
