import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { CategoryMappings, ConditionMappings, CurrencyMappings, ListingOrderItems, ListingTypeMappings, SiteSpecificListingInfo  } from '../index';

@Entity('trading_site', { schema: 'general' })
export class TradingSite {

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

  @Column('nvarchar', {
    nullable: true,
    length: 100,
    name: 'desc',
  })
  desc: string | null;

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
