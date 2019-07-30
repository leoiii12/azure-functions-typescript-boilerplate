import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from '../index';

@Entity('login_history', { schema: 'auth' })
export class LoginHistory {

  @PrimaryColumn('datetime2', {
    nullable: false,
    default: () => 'getdate()',
    name: 'login_time',
  })
  loginTime: Date;

  @PrimaryColumn({ nullable: false ,  name: 'user_id' })
  userID: string;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  user: User ;

}

export class LoginHistoryDto {

  constructor(
    public userID: number,
    public userName: string,
    public loginTime: Date,
    ) {
  }
}
