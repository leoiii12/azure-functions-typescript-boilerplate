import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Items } from '../index';

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

  @PrimaryGeneratedColumn()
  id: string;

  @Column('nvarchar', {
    nullable: false,
    length: 100,
    name: 'item_id',
  })
  itemID: string;
}
export class ItemDetailsDto {

  constructor(
    public itemSpecificsName: string,
    public itemSpecificDesc: string,
    public itemID: number,
    public itemName: string) {
  }
}
