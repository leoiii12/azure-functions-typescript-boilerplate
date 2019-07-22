import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './user';

@Entity('refresh_token', { schema: 'auth' })
@Index('IX_refresh_token', ['refreshToken'], { unique: true })
export class RefreshToken {

  @Column('nvarchar', {
    nullable: true,
    length: 150,
    name: 'refresh_token',
  })
  refreshToken: string | null;

  @Column('nvarchar', {
    nullable: true,
    length: 150,
    name: 'user_agent_hash',
  })
  userAgentHash: string | null;

  @Column('datetime2', {
    nullable: false,
    default: () => 'getdate()',
    name: 'generated_time',
  })
  generatedTime: Date;

  @ManyToOne(type => User, user => user.refreshTokens, { primary: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

}

export class RefreshTokenDto {

  constructor(
    public userID: number,
    public userAgentHash: string,
    public generatedTime: Date,
    ) {
  }
}
