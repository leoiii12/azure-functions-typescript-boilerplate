import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Category } from './category';
import { Currency } from './currency';
import { User } from './user';
import { Condition } from './condition';
import { ItemDetails } from './item_details';
import { ItemGallery } from './item_gallery';
import { ListingOrderItems } from './listing_order_items';
import { SiteSpecificListingInfo } from './site_specific_listing_info';
import { UpdateItemQuantity } from './update_item_quantity';

@Entity('items', { schema: 'inventory' })
export class Items {

  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(type => Category, category => category.items, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Column('nvarchar', {
    nullable: false,
    length: 100,
    name: 'brand',
  })
  brand: string;

  @Column('nvarchar', {
    nullable: true,
    length: 100,
    name: 'manufacturer',
  })
  manufacturer: string | null;

  @Column('nvarchar', {
    nullable: true,
    length: 100,
    name: 'main_pic_url',
  })
  mainPicUrl: string | null;

  @Column('nvarchar', {
    nullable: true,
    length: 100,
    name: 'main_pic_name',
  })
  mainPicName: string | null;

  @ManyToOne(type => Currency, currency => currency.itemss, { nullable: false })
  @JoinColumn({ name: 'cur_id' })
  cur: Currency | null;

  @Column('decimal', {
    nullable: true,
    precision: 10,
    scale: 2,
    name: 'price',
  })
  price: number | null;

  @Column('decimal', {
    nullable: false,
    precision: 10,
    scale: 2,
    name: 'shipping_cost',
  })
  shippingCost: number;

  @Column('decimal', {
    nullable: true,
    precision: 10,
    scale: 2,
    name: 'shipping_additional_cost',
  })
  shippingAdditionalCost: number | null;

  @Column('text', {
    nullable: true,
    name: 'description',
  })
  description: string | null;

  @Column('decimal', {
    nullable: false,
    precision: 10,
    scale: 2,
    name: 'quantity',
  })
  quantity: number;

  @ManyToOne(type => User, user => user.items, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column('nvarchar', {
    nullable: true,
    length: 40,
    name: 'manufacturer_part_numbers',
  })
  manufacturerPartNumbers: string | null;

  @Column('nvarchar', {
    nullable: false,
    length: 100,
    name: 'title',
  })
  title: string;

  @ManyToOne(type => Condition, condition => condition.items, { nullable: false })
  @JoinColumn({ name: 'condition_id' })
  condition: Condition | null;

  @OneToMany(type => ItemDetails, itemDetails => itemDetails.item)
  itemDetails: ItemDetails[];

  @OneToMany(type => ItemGallery, itemGallery => itemGallery.item)
  itemGalleries: ItemGallery[];

  @OneToMany(type => ListingOrderItems, listingOrderItems => listingOrderItems.item)
  listingOrderItems: ListingOrderItems[];

  @OneToMany(type => SiteSpecificListingInfo, siteSpecificListingInfo => siteSpecificListingInfo.item)
  siteSpecificListingInfos: SiteSpecificListingInfo[];

  @OneToMany(type => UpdateItemQuantity, updateItemQuantity => updateItemQuantity.item)
  updateItemQuantities: UpdateItemQuantity[];

}

export class ItemsDto {
  constructor(
    public id : number,
    public categoryName : string,
    public categoryID : number,
    public price : number,
    public shippingCost: number,
    public shippingAdditionalCost : number,
    public description : string,
    public quantity : number,
    public manufacturerPartNumbers : string,
    public title : string,
  ) {}
}
