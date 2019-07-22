import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { ConditionMappings } from './condition_mappings';
import { Items } from './items';

@Entity('condition', { schema: 'general' })
export class Condition {

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

  @OneToMany(type => ConditionMappings, conditionMappings => conditionMappings.condition)
  conditionMappings: ConditionMappings[];

  @OneToMany(type => Items, items => items.condition)
  items: Items[];

}

export class ConditionDto {

  constructor(
    public id: number,
    public name: string) {
  }
}
