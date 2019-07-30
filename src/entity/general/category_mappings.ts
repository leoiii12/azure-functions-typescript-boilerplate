import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Category, TradingSite } from '../index';

@Entity('category_mappings', { schema: 'mappings' })
export class CategoryMappings {

  @PrimaryColumn({ nullable: false ,  name: 'category_id' })
  categoryID: number;

  @ManyToOne(type => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('nchar', {
    nullable: false,
    length: 20,
    name: 'category_site_specific_id',
  })
  categorySiteSpecificID: string;

  @PrimaryColumn({ nullable: false ,  name: 'trading_site_id' })
  tradingSiteID: number;

  @ManyToOne(type => TradingSite)
  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite;

}

export class CategoryMappingsDto {
  constructor(
    public categoryID: number,
    public categoryName: string,
    public tradingSiteID: number,
    public tradingSiteName: string,
    public newCategoryID : number,
    ) {
  }
}
