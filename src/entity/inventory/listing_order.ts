import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User, ListingOrderItems } from '../index';

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

  @Column({ nullable: false ,  name: 'user_id' })
  userID: string;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @PrimaryGeneratedColumn()
  id: string;

  @OneToMany(type => ListingOrderItems, listingOrderItems => listingOrderItems.oreder)
  listingOrderItems: ListingOrderItems[];

}

export class ListOrderDto {
  constructor(
    public orderTime : Date,
    public orderComment : string,
    public orderID : number,
  ) {}
}
