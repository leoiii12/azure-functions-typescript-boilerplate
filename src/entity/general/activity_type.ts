import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { UserActivity } from '../index';

@Entity('activity_type', { schema: 'general' })
export class ActivityType {

  @PrimaryColumn('int', {
    nullable: false,
    primary: true,
    name: 'id',
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    length: 45,
    name: 'name',
  })
  name: string;

}

export class ActivityTypeDto {
  constructor(
    public id: number,
    public name: string) {
  }
  static from(activityType: ActivityType): ActivityTypeDto {
    return new ActivityTypeDto(
     activityType.id,
     activityType.name,
    );
  }
}
