import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Condition, TradingSite } from '../index';

@Entity('condition_mappings', { schema: 'mappings' })
export class ConditionMappings {

  @PrimaryColumn({ nullable: false ,  name: 'condition_id' })
  conditionID: number;

  @ManyToOne(type => Condition)
  @JoinColumn({ name: 'condition_id' })
  condition: Condition;

  @Column('nchar', {
    nullable: false,
    length: 20,
    name: 'condition_site_specific_id',
  })
  conditionSiteSpecificID: string;

  @PrimaryColumn({ nullable: false ,  name: 'trading_site_id'})
  tradingSiteID: number;

  @ManyToOne(type => TradingSite)
  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite;

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
