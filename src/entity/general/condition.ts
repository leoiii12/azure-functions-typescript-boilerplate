import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { ConditionMappings, Items } from '../index';

@Entity('condition', { schema: 'general' })
export class Condition {

  @PrimaryColumn('int', {
    nullable: false,
    primary: true,
    generated: true,
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

export class ConditionDto {

  constructor(
    public id: number,
    public name: string) {
  }
}
