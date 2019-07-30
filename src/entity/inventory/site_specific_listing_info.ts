import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { TradingSite, Items, User, ListingType } from '../index';

@Entity('site_specific_listing_info', { schema: 'listings' })
export class SiteSpecificListingInfo {

  @PrimaryColumn({ nullable: false ,  name: 'trading_site_id' })
  tradingSiteID: number;

  @ManyToOne(type => TradingSite)
  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite ;

  @PrimaryColumn('nvarchar', {
    nullable: false,
    length: 100,
    name: 'item_id',
    primary: true,
  })
  itemID: string;

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

  @Column({ nullable: false ,  name: 'last_listing_type_id' })
  lastListingTypeID: number;

  @ManyToOne(type => ListingType)
  @JoinColumn({ name: 'last_listing_type_id' })
  lastListingType: ListingType;

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
