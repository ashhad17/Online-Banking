import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  sender_account: string;

  @Column()
  receiver_account: string;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: ['IMPS', 'NEFT', 'RTGS'] })
  mode: 'IMPS' | 'NEFT' | 'RTGS';

  @Column({ type: 'enum', enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' })
  status: 'PENDING' | 'SUCCESS' | 'FAILED';

  @CreateDateColumn()
  created_at: Date;
}
