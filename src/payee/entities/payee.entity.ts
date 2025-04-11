import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Payee {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  beneficiary_name: string;

  @Column()
  beneficiary_account_number: string;

  @Column({ nullable: true })
  nickname: string;

  @CreateDateColumn()
  created_at: Date;
}
