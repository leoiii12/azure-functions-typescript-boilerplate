import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { ListingOrderItems } from './listing_order_items';
import { ListingTypeMappings } from './listing_type_mappings';
import { SiteSpecificListingInfo } from './site_specific_listing_info';

@Entity('listing_type', { schema: 'general' })
export class ListingType {

  @Column('int', {
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

  @OneToMany(type => ListingOrderItems, listingOrderItems => listingOrderItems.listingType)
  listingOrderItemss: ListingOrderItems[];

  @OneToMany(type => ListingTypeMappings, listingTypeMappings => listingTypeMappings.listingType)
  listingTypeMappingss: ListingTypeMappings[];

  @OneToMany(type => SiteSpecificListingInfo, siteSpecificListingInfo => siteSpecificListingInfo.lastListingType)
  siteSpecificListingInfos: SiteSpecificListingInfo[];

}
export class ListingTypeDto {

  constructor(
    public id: number,
    public name: string,
    ) {
  }
}
