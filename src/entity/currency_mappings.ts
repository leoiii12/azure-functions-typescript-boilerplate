import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Currency } from './currency';
import { TradingSite } from './trading_site';

@Entity('currency_mappings', { schema: 'mappings' })
export class CurrencyMappings {

  @ManyToOne(type => Currency, currency => currency.currencyMappingss, { primary: true, nullable: false })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency | null;

  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite | null;

  @Column('nchar', {
    nullable: false,
    length: 20,
    name: 'currency_site_specific_id',
  })
  currencySiteSpecificID: string;

}
export class CurrencyMappingsDto {
  constructor(
    public currencyID: number,
    public currencyName: string,
    public tradingSiteID: number,
    public tradingSiteName: string,
    public newCurrencyID : number,
    ) {
  }
}
