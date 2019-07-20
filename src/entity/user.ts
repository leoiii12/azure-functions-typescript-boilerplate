import {
    AfterLoad, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { DeviceHistory } from './device-history';

export enum UserRole {
  Users = 1000,
  Admins = 9999,
}

@Entity('user')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  emailAddress: string;

  @Column()
  password: string;

  @Column('simple-array')
  roles: UserRole[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @Column({ nullable: true })
  tokenVersion: string;

  @Column({ default: true })
  enabled: boolean = true;

  @OneToMany(() => DeviceHistory, d => d.userId)
  deviceHistories: DeviceHistory[];

  @AfterLoad()
  onLoad() {
    if (this.roles) {
      this.roles = this.roles.map((r: any) => parseInt(r, undefined) as UserRole);
    }
  }

}

export class UserListDto {
  constructor(
    public id: string,
    public emailAddress: string,
  ) {
  }

  static from(user: User): UserListDto {
    return new UserListDto(
      user.id,
      user.emailAddress,
    );
  }
}

export class MyUserDto {

  constructor(
    public id: string,
    public emailAddress: string,
    public roles: UserRole[],
    public createDate: Date,
    public updateDate: Date,
  ) {
  }

  static from(user: User): MyUserDto {
    return new MyUserDto(
      user.id,
      user.emailAddress,
      user.roles,
      user.createDate,
      user.updateDate,
    );
  }

}
