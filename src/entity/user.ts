import {
    Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

import { DeviceHistory } from './device-history';
import { Role } from './role';

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mobilePhone: string;

  @Column()
  password: string;

  @Column('simple-array')
  roles: Role[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @OneToMany(type => DeviceHistory, d => d.userId)
  deviceHistories: DeviceHistory[];

}
