import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { ListingOrder } from './listing_order';
import { Items } from './items';
import { ListingType } from './listing_type';
import { TradingSite } from './trading_site';

@Entity('listing_order_items', { schema: 'listings' })
export class ListingOrderItems {

  @ManyToOne(type => ListingOrder, listingOrder => listingOrder.listingOrderItemss, { primary: true, nullable: false })
  @JoinColumn({ name: 'oreder_id' })
  oreder: ListingOrder | null;

  @ManyToOne(type => Items, items => items.listingOrderItems, { primary: true, nullable: false })
  @JoinColumn({ name: 'item_id' })
  item: Items | null;

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

  @ManyToOne(type => ListingType, listingType => listingType.listingOrderItemss, { nullable: false })
  @JoinColumn({ name: 'listing_type_id' })
  listingType: ListingType | null;

  @ManyToOne(type => TradingSite, tradingSite => tradingSite.listingOrderItemss, { nullable: false })
  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite | null;

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
