import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Condition } from './condition';
import { TradingSite } from './trading_site';

@Entity('condition_mappings', { schema: 'mappings' })
export class ConditionMappings {

  @ManyToOne(type => Condition, condition => condition.conditionMappings, { primary: true, nullable: false, })
  @JoinColumn({ name: 'condition_id' })
  condition: Condition | null;

  @Column('nchar', {
    nullable: false,
    length: 20,
    name: 'condition_site_specific_id',
  })
  conditionSiteSpecificID: string;

  @ManyToOne(type => TradingSite, tradingSite => tradingSite.conditionMappingss, { primary: true, nullable: false })
  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite | null;

}
export class ConditionMappingsDto {
  constructor(
    public conditionID: number,
    public conditionName: string,
    public tradingSiteID: number,
    public tradingSiteName: string,
    public newConditionID : number,
    ) {
  }
}
