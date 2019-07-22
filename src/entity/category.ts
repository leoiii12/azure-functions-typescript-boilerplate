import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { CategoryMappings } from './category_mappings';
import { Items } from './items';

@Entity('category', { schema: 'general' })
export class Category {

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

  @ManyToOne(type => Category, category => category.categories, {})
  @JoinColumn({ name: 'parentid' })
  parent: Category | null;

  @OneToMany(type => Category, category => category.parent)
  categories: Category[];

  @OneToMany(type => CategoryMappings, categoryMappings => categoryMappings.category)
  categoryMappingss: CategoryMappings[];

  @OneToMany(type => Items, items => items.category)
  items: Items[];

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
