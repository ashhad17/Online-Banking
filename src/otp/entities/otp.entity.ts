import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  otp_code: string;

  @Column({ type: 'enum', enum: ['FORGOT_USERID', 'FORGOT_PASSWORD'], default: 'FORGOT_PASSWORD' })
  purpose: 'FORGOT_USERID' | 'FORGOT_PASSWORD';

  @Column({ default: false })
  is_used: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  expires_at: Date;
}
