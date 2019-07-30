import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Category, Currency, User, Condition, ItemDetails, ItemGallery, ListingOrderItems, SiteSpecificListingInfo, UpdateItemQuantity } from '../index';

@Entity('items', { schema: 'inventory' })
export class Items {

  // @PrimaryGeneratedColumn()
  // id: string;

  @PrimaryColumn('uniqueidentifier', {
    nullable:false,
    primary:true,
    default: () => 'newid()',
    name:'id',
  })
  id:string;

  @Column({ nullable: false ,  name: 'category_id' })
  categoryID: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category ;

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
  manufacturer: string ;

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

  @Column({ nullable: false ,  name: 'cur_id' })
  curID: number;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'cur_id' })
  cur: Currency ;

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
  shippingCost: number | null;

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

  @Column({ nullable: false ,  name: 'user_id' })
  userID: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

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

  @Column({ nullable: false ,  name: 'condition_id' })
  conditionID: number;

  @ManyToOne(() => Condition)
  @JoinColumn({ name: 'condition_id' })
  condition: Condition ;

  @OneToMany(() => ItemDetails, (itemDetails: ItemDetails) => itemDetails.itemID)
  itemDetails: ItemDetails[];

  @OneToMany(() => ItemGallery, (itemGallery: ItemGallery) => itemGallery.itemID)
  itemGalleries: ItemGallery[];

  @OneToMany(() => SiteSpecificListingInfo, (siteSpecificListingInfo : SiteSpecificListingInfo) => siteSpecificListingInfo.itemID)
  siteSpecificListingInfos: SiteSpecificListingInfo[];

  @OneToMany(() => UpdateItemQuantity, (updateItemQuantity:UpdateItemQuantity) => updateItemQuantity.itemID)
  updateItemQuantities: UpdateItemQuantity[];

}

export class ItemsDto {
  constructor(
    public id : string,
    public categoryName : string,
    public categoryID : number,
    public conditionName : string,
    public conditionID : number,
    public currencyName : string,
    public currencyID : number,
    public price : number | null,
    public shippingCost: number | null,
    public shippingAdditionalCost : number | null,
    public description : string | null,
    public quantity : number,
    public manufacturerPartNumbers : string | null,
    public title : string,
    public manufacturer : string,

  ) {}
  static from(item: Items): ItemsDto {
    return new ItemsDto(
      item.id,
      item.category.name ,
      item.category.id,
      item.condition.name,
      item.condition.id,
      item.cur.name,
      item.cur.id,
      item.price,
      item.shippingCost,
      item.shippingAdditionalCost,
      item.description,
      item.quantity,
      item.manufacturerPartNumbers,
      item.title,
      item.manufacturer,
    );
  }
}
