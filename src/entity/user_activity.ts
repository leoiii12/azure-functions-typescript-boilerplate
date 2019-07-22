import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './user';
import { ActivityType } from './activity_type';

@Entity('user_activity', { schema: 'auth' })
export class UserActivity {

  @ManyToOne(type => User, user => user.userActivitys, { primary: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column('datetime2', {
    nullable: false,
    default: () => 'getdate()',
    name: 'event_time',
  })
  eventTime: Date;

  @Column('nvarchar', {
    nullable: true,
    length: 150,
    name: 'description',
  })
  description: string | null;

  @ManyToOne(type => ActivityType, activityType => activityType.userActivitys, {})
  @JoinColumn({ name: 'activity_id' })
  activity: ActivityType | null;

}

export class UserActivityDto {
  constructor(
    public eventTime : Date,
    public description : string,
  ) {}
}
