import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class InternetBanking {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  user_id: number;

  @Column()
  login_password: string;

  @Column()
  transaction_password: string;

  @Column({ default: 0 })
  login_attempts: number;

  @Column({ default: false })
  is_locked: boolean;
}
