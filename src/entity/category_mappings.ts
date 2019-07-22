import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Category } from './category';
import { TradingSite } from './trading_site';

@Entity('category_mappings', { schema: 'mappings' })
export class CategoryMappings {

  @ManyToOne(type => Category, category => category.categoryMappingss, { primary: true, nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Column('nchar', {
    nullable: false,
    length: 20,
    name: 'category_site_specific_id',
  })
  categorySiteSpecificID: string;

  @ManyToOne(type => TradingSite, tradingSite => tradingSite.categoryMappingss, { primary: true, nullable: false })
  @JoinColumn({ name: 'trading_site_id' })
  tradingSite: TradingSite | null;

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
