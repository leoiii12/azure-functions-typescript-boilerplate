import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { TradingSite } from './trading_site';
import { Items } from './items';
import { User } from './user';
import { ListingType } from './listing_type';

@Entity('site_specific_listing_info', { schema: 'listings' })
export class SiteSpecificListingInfo {

  @ManyToOne(type => TradingSite, tradingSite => tradingSite.siteSpecificListingInfos, { primary: true, nullable: false })
  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite | null;

  @ManyToOne(type => Items, items => items.siteSpecificListingInfos, { primary: true, nullable: false })
  @JoinColumn({ name: 'item_id' })
  item: Items | null;

  @Column('decimal', {
    nullable: false,
    precision: 10,
    scale: 2,
    name: 'quantity',
  })
  quantity: number;

  @Column('tinyint', {
    nullable: false,
    default: () => '(1)',
    name: 'status',
  })
  status: number;

  @Column('decimal', {
    nullable: false,
    precision: 10,
    scale: 2,
    name: 'last_price',
  })
  lastPrice: number;

  @Column('nvarchar', {
    nullable: true,
    length: 100,
    name: 'item_url',
  })
  itemUrl: string | null;

  @ManyToOne(type => User, user => user.siteSpecificListingInfos, {})
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @ManyToOne(type => ListingType, listingType => listingType.siteSpecificListingInfos, {})
  @JoinColumn({ name: 'last_listing_type_id' })
  lastListingType: ListingType | null;

}

export class SiteSpecificListingInfoDto {
  constructor(
    public itemName : string,
    public itemID : number,
    public lastPrice : number,
    public quantity : number,
    public itemUrl : string,
    public status : number,
    public listingTypeID : number,
    public listingTypeName : string,
    public tradingSiteID : number,
    public tradingSiteName : string,
  ) {}
}
