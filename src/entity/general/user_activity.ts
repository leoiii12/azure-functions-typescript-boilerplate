import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User, ActivityType } from '../index';

@Entity('user_activity', { schema: 'auth' })
export class UserActivity {

  @PrimaryColumn({ nullable: false ,  name: 'user_id' })
  userID: string;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @PrimaryColumn('datetime2', {
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

  @Column({ nullable: false ,  name: 'activity_id' })
  activityID: number;

  @ManyToOne(type => ActivityType)
  @JoinColumn({ name: 'activity_id' })
  activity: ActivityType;

}

export class UserActivityDto {
  constructor(
    public eventTime : Date,
    public description : string,
  ) {}
}
