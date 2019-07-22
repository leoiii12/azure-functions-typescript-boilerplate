import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { CategoryMappings } from './category_mappings';
import { ConditionMappings } from './condition_mappings';
import { CurrencyMappings } from './currency_mappings';
import { ListingOrderItems } from './listing_order_items';
import { ListingTypeMappings } from './listing_type_mappings';
import { SiteSpecificListingInfo } from './site_specific_listing_info';

@Entity('trading_site', { schema: 'general' })
export class TradingSite {

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

  @Column('nvarchar', {
    nullable: true,
    length: 100,
    name: 'desc',
  })
  desc: string | null;

  @OneToMany(type => CategoryMappings, categoryMappings => categoryMappings.tradingSite)
  categoryMappingss: CategoryMappings[];

  @OneToMany(type => ConditionMappings, conditionMappings => conditionMappings.tradingSite)
  conditionMappingss: ConditionMappings[];

  @OneToMany(type => CurrencyMappings, currencyMappings => currencyMappings.tradingSite)
  currencyMappingss: CurrencyMappings[];

  @OneToMany(type => ListingOrderItems, listingOrderItems => listingOrderItems.tradingSite)
  listingOrderItemss: ListingOrderItems[];

  @OneToMany(type => ListingTypeMappings, listingTypeMappings => listingTypeMappings.tradingSite)
  listingTypeMappingss: ListingTypeMappings[];

  @OneToMany(type => SiteSpecificListingInfo, siteSpecificListingInfo => siteSpecificListingInfo.tradingSite)
  siteSpecificListingInfos: SiteSpecificListingInfo[];

}

export class TradingSiteDto {

  constructor(
    public id: number,
    public name: string,
    ) {
  }
  static from(site: TradingSite): TradingSiteDto {
    return new TradingSiteDto(
     site.id,
     site.name,
    );
  }
}
