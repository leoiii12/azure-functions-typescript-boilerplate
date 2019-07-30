import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from '../index';

@Entity('refresh_token', { schema: 'auth' })
@Index('IX_refresh_token', ['refreshToken'], { unique: true })
export class RefreshToken {

  @Column('nvarchar', {
    nullable: false,
    length: 150,
    name: 'refresh_token',
  })
  refreshToken: string ;

  @Column('nvarchar', {
    nullable: false,
    length: 150,
    name: 'user_agent_hash',
  })
  userAgentHash: string;

  @Column('datetime2', {
    nullable: false,
    default: () => 'getdate()',
    name: 'generated_time',
  })
  generatedTime: Date;

  @PrimaryColumn({ nullable: false ,  name: 'user_id' })
  userID: string;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

}

export class RefreshTokenDto {

  constructor(
    public userID: number,
    public userAgentHash: string,
    public generatedTime: Date,
    ) {
  }
}
