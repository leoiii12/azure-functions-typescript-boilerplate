import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './user';
import { ListingOrderItems } from './listing_order_items';

@Entity('listing_order', { schema: 'listings' })
export class ListingOrder {

  @Column('datetime2', {
    nullable: false,
    default: () => 'getdate()',
    name: 'order_time',
  })
  orderTime: Date;

  @Column('nvarchar', {
    nullable: true,
    length: 150,
    name: 'order_comment',
  })
  orderComment: string | null;

  @ManyToOne(type => User, user => user.listingOrders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @PrimaryGeneratedColumn()
  id: string;

  @OneToMany(type => ListingOrderItems, listingOrderItems => listingOrderItems.oreder)
  listingOrderItemss: ListingOrderItems[];

}

export class ListOrderDto {
  constructor(
    public orderTime : Date,
    public orderComment : string,
    public orderID : number,
  ) {}
}
