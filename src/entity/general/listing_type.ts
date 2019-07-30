import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { ListingOrderItems, ListingTypeMappings, SiteSpecificListingInfo } from '../index';

@Entity('listing_type', { schema: 'general' })
export class ListingType {

  @PrimaryColumn('int', {
    nullable: false,
    primary: true,
    name: 'id',
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    length: 100,
    name: 'name',
  })
  name: string;

}

export class ListingTypeDto {

  constructor(
    public id: number,
    public name: string,
    ) {
  }
}
