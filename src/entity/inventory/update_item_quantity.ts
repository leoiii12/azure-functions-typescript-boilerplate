import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Items, User } from '../index';

@Entity('update_item_quantity', { schema: 'inventory' })
export class UpdateItemQuantity {

  @PrimaryColumn('nvarchar', {
    nullable: false,
    length: 100,
    name: 'item_id',
  })
  itemID: string;

  @PrimaryColumn('datetime2', {
    nullable: false,
    default: () => 'getdate()',
    name: 'action_time',
  })
  actionTime: Date;

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
