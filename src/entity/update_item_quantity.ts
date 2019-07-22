import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Items } from './items';
import { User } from './user';

@Entity('update_item_quantity', { schema: 'inventory' })
export class UpdateItemQuantity {

  @ManyToOne(type => Items, items => items.updateItemQuantities, { primary: true, nullable: false })
  @JoinColumn({ name: 'item_id' })
  item: Items | null;

  @Column('datetime2', {
    nullable: false,
    primary: true,
    default: () => 'getdate()',
    name: 'action_time',
  })
  actionTime: Date;

  @ManyToOne(type => User, user => user.updateItemQuantitys, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column('decimal', {
    nullable: false,
    precision: 10,
    scale: 2,
    name: 'quantity',
  })
  quantity: number;

  @Column('nvarchar', {
    nullable: true,
    length: 100,
    name: 'desc',
  })
  desc: string | null;

}

export class UpdateItemQuantityDto {
  constructor(
    public actionTime : Date,
    public quantity : number,
    public desc : string,
  ) {}
}
