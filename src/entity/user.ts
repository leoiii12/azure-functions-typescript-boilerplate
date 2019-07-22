import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Items } from './items';
import { ListingOrder } from './listing_order';
import { LoginHistory } from './login_history';
import { RefreshToken } from './refresh_token';
import { SiteSpecificListingInfo } from './site_specific_listing_info';
import { UpdateItemQuantity } from './update_item_quantity';
import { UserActivity } from './user_activity';

export enum Role {
  Users = 1000,
  Admins = 9999,
}
@Entity('user', { schema: 'auth' })
export class User {

  @PrimaryGeneratedColumn()
  id: string;

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

  @OneToMany(type => Items, items => items.user)
  items: Items[];

  @OneToMany(type => ListingOrder, listingOrder => listingOrder.user)
  listingOrders: ListingOrder[];

  @OneToMany(type => LoginHistory, loginHistory => loginHistory.user)
  loginHistorys: LoginHistory[];

  @OneToMany(type => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(type => SiteSpecificListingInfo, siteSpecificListingInfo => siteSpecificListingInfo.user)
  siteSpecificListingInfos: SiteSpecificListingInfo[];

  @OneToMany(type => UpdateItemQuantity, updateItemQuantity => updateItemQuantity.user)
  updateItemQuantitys: UpdateItemQuantity[];

  @OneToMany(type => UserActivity, userActivity => userActivity.user)
  userActivitys: UserActivity[];

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
