import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { TradingSite } from './trading_site';
import { ListingType } from './listing_type';

@Entity('listing_type_mappings', { schema: 'mappings' })
export class ListingTypeMappings {

  @ManyToOne(type => TradingSite, tradingSite => tradingSite.listingTypeMappingss, { primary: true, nullable: false })
  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite | null;

  @ManyToOne(type => ListingType, listingType => listingType.listingTypeMappingss, { primary: true, nullable: false })
  @JoinColumn({ name: 'listing_type_id' })
  listingType: ListingType | null;

  @Column('nchar', {
    nullable: false,
    length: 20,
    name: 'listing_type_site_specific_id',
  })
  listingTypeSiteSpecificID: string;

}
export class ListingTypeMappingsDto {
  constructor(
    public listingTypeID: number,
    public listingTypeName: string,
    public tradingSiteID: number,
    public tradingSiteName: string,
    public newListingTypeID : number,
    ) {
  }
}
