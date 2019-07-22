import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { UserActivity } from './user_activity';

@Entity('activity_type', { schema: 'general' })
export class ActivityType {

  @Column('int', {
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

  @OneToMany(type => UserActivity, userActivity => userActivity.activity)
  userActivitys: UserActivity[];

}

export class ActivityTypeDto {
  constructor(
    public id: number,
    public name: string) {
  }
}
