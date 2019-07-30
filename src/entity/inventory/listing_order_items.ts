import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { ListingOrder, Items, TradingSite, ListingType  } from '../index';

@Entity('listing_order_items', { schema: 'listings' })
export class ListingOrderItems {

  @PrimaryColumn({ nullable: false ,  name: 'oreder_id' })
  orederID: string;

  @ManyToOne(type => ListingOrder, listingOrder => listingOrder.listingOrderItems)
  @JoinColumn({ name: 'oreder_id' })
  oreder: ListingOrder;

  @PrimaryColumn('nvarchar', {
    nullable: false,
    length: 100,
    name: 'item_id',
  })
  itemID: string;

  @Column('decimal', {
    nullable: false,
    precision: 10,
    scale: 2,
    name: 'quantity',
  })
  quantity: number;

  @Column('decimal', {
    nullable: false,
    precision: 10,
    scale: 2,
    name: 'price',
  })
  price: number;

  @Column({ nullable: false ,  name: 'listing_type_id' })
  listingTypeID: number;

  @ManyToOne(type => ListingType)
  @JoinColumn({ name: 'listing_type_id' })
  listingType: ListingType ;

  @Column({ nullable: false ,  name: 'trading_site_id' })
  tradingSiteID: number;

  @ManyToOne(type => TradingSite)
  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite ;

  @Column('text', {
    nullable: true,
    name: 'message_returned',
  })
  messageReturned: string | null;

  @Column('tinyint', {
    nullable: false,
    default: () => '(1)',
    name: 'status',
  })
  status: number;

}

export class ListOrderItemsDto {
  constructor(
    public orderID : number,
    public itemName : string,
    public itemID : number,
    public price : number,
    public quantity : number,
    public messageReturned : string,
    public status : number,
    public listingTypeID : number,
    public listingTypeName : string,
    public tradingSiteID : number,
    public tradingSiteName : string,
  ) {}
}
