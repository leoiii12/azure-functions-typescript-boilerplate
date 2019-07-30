import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { CurrencyMappings, Items } from '../index';

@Entity('currency', { schema: 'general' })
export class Currency {

  @Column('int', {
    nullable: false,
    primary: true,
    generated : true,
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

}

export class CurrencyDto {

  constructor(
    public id: number,
    public name: string) {
  }
}
