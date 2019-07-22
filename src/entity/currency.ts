import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { CurrencyMappings } from './currency_mappings';
import { Items } from './items';

@Entity('currency', { schema: 'general' })
export class Currency {

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

  @Column('varchar', {
    nullable: true,
    length: 100,
    name: 'desc',
  })
  desc: string | null;

  @OneToMany(type => CurrencyMappings, currencyMappings => currencyMappings.currency)
  currencyMappingss: CurrencyMappings[];

  @OneToMany(type => Items, items => items.cur)
  itemss: Items[];

}

export class CurrencyDto {

  constructor(
    public id: number,
    public name: string) {
  }
}
