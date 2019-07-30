import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { UserActivity, RefreshToken, ListingOrder, LoginHistory, SiteSpecificListingInfo, UpdateItemQuantity, Items } from '../index';

export enum Role {
  Users = 1000,
  Admins = 9999,
}
@Entity('user', { schema: 'auth' })
export class  User {

  // @PrimaryGeneratedColumn()
  // id: string;

  @PrimaryColumn('uniqueidentifier', {
    nullable:false,
    primary:true,
    default: () => 'newid()',
    name:'id',
  })
  id:string;

  @Column('nvarchar', {
    nullable: false,
    name: 'password',
  })
  password: string;

  @Column('simple-array')
  roles: Role[];

  @Column('datetime2', {
    nullable: false,
    default: () => 'getdate()',
    name: 'createDate',
  })
  createDate: Date;

  @Column('datetime2', {
    nullable: false,
    default: () => 'getdate()',
    name: 'updateDate',
  })
  updateDate: Date;

  @Column('bit', {
    nullable: false,
    name: 'enabled',
  })
  enabled: boolean;

  @Column('varchar', {
    nullable: true,
    length: 100,
    name: 'paypal_email',
  })
  paypalEmail: string | null;

  @Column('nvarchar', {
    nullable: false,
    length: 100,
    name: 'fn',
  })
  fn: string;

  @Column('nvarchar', {
    nullable: false,
    length: 100,
    name: 'ln',
  })
  ln: string;

  @Column('nvarchar', {
    nullable: true,
    length: 50,
    name: 'brand_name',
  })
  brandName: string | null;

  @Column('nvarchar', {
    nullable: true,
    length: 50,
    name: 'business_name',
  })
  businessName: string | null;

  @Column('varchar', {
    nullable: false,
    length: 100,
    name: 'work_email',
  })
  workEmail: string;

  @Column('varchar', {
    nullable: true,
    length: 15,
    name: 'phone',
  })
  phone: string | null;

}

export class UserDto {
  constructor(
    public id : string,
    public roles : Role[],
    public decreateDatesc : Date,
    public enabled : boolean,
    public paypalEmail : string | null,
    public firstName : string,
    public lastName : string,
    public workEmail : string,
    public brandName : string | null,
    public businessName : string | null,
    public phone : string | null,
  ) {}
  static from(user: User): UserDto {
    return new UserDto(
      user.id,
      user.roles,
      user.createDate,
      user.enabled,
      user.paypalEmail,
      user.fn,
      user.ln,
      user.workEmail,
      user.brandName,
      user.businessName,
      user.phone,
    );
  }
}
