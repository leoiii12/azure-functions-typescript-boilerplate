import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { TradingSite, ListingType } from '../index';

@Entity('listing_type_mappings', { schema: 'mappings' })
export class ListingTypeMappings {

  @PrimaryColumn({ nullable: false ,  name: 'trading_site_id' })
  tradingSiteID: number;

  @ManyToOne(type => TradingSite)
  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite;

  @PrimaryColumn({ nullable: false ,  name: 'listing_type_id'})
  listingTypeID: number;

  @ManyToOne(type => ListingType)
  @JoinColumn({ name: 'listing_type_id' })
  listingType: ListingType ;

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
