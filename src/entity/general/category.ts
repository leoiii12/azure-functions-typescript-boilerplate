import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { CategoryMappings, Items } from '../index';

@Entity('category', { schema: 'general' })
export class Category {

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

  @ManyToOne(type => Category, { nullable:true })
  @JoinColumn({ name: 'parentid' })
  parent: Category | null;

}

export class CategoryDto {

  constructor(
    public id: number,
    public name: string) {
  }
}

export class CategoryWithParentsDto {

  constructor(
    public id: number,
    public name: string,
    public parent: number) {
  }
}
