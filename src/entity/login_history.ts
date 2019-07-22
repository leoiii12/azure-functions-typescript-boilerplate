import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './user';

@Entity('login_history', { schema: 'auth' })
export class LoginHistory {

  @Column('datetime2', {
    nullable: false,
    primary: true,
    default: () => 'getdate()',
    name: 'login_time',
  })
  loginTime: Date;

  @ManyToOne(type => User, user => user.loginHistorys, { primary: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

}

export class LoginHistoryDto {

  constructor(
    public userID: number,
    public userName: string,
    public loginTime: Date,
    ) {
  }
}
