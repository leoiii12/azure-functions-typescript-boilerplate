import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Currency, TradingSite } from '../index';

@Entity('currency_mappings', { schema: 'mappings' })
export class CurrencyMappings {

  @PrimaryColumn({ nullable: false ,  name: 'currency_id' })
  currencyID: number;

  @ManyToOne(type => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency ;

  @PrimaryColumn({ nullable: false ,  name: 'trading_site_id' })
  tradingSiteID: number;

  @ManyToOne(type => TradingSite)
  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite;

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
