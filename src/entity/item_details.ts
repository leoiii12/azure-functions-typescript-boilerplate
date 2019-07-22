import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Items } from './items';

@Entity('item_details', { schema: 'inventory' })
export class ItemDetails {

  @Column('nvarchar', {
    nullable: false,
    length: 100,
    name: 'item_specifics_name',
  })
  itemSpecificsName: string;

  @Column('nvarchar', {
    nullable: false,
    length: 100,
    name: 'item_specifics_desc',
  })
  itemSpecificDesc: string;

  @ManyToOne(type => Items, items => items.itemDetails, { nullable: false })
  @JoinColumn({ name: 'item_id' })
  item: Items | null;

  @PrimaryGeneratedColumn()
  id: string;

}
export class ItemDetailsDto {

  constructor(
    public itemSpecificsName: string,
    public itemSpecificDesc: string,
    public itemID: number,
    public itemName: string) {
  }
}
