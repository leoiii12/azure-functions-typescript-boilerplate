import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Items } from '../index';

@Entity('item_gallery', { schema: 'inventory' })
export class ItemGallery {

  @PrimaryGeneratedColumn()
  id: string;

  @Column('nvarchar', {
    nullable: false,
    length: 100,
    name: 'item_id',
  })
  itemID: string;

  @Column('nvarchar', {
    nullable: false,
    length: 100,
    name: 'picname',
  })
  picname: string;

  @Column('nvarchar', {
    nullable: true,
    length: 100,
    name: 'url',
  })
  url: string | null;

  @Column('nvarchar', {
    nullable: true,
    length: 100,
    name: 'local_adr',
  })
  localAddress: string | null;

}
export class ItemGalleryDto {

  constructor(
    public id: string,
    public picName: string,
    public itemID: number,
    public itemName: string,
    public url: string,
    public localAddress: string,
    ) {
  }
}
