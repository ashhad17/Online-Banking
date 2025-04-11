import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Account } from '../../account/entities/account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  aadhar: string;

  @Column()
  dob: Date;

  @Column('text')
  residential_address: string;

  @Column('text')
  permanent_address: string;

  @Column()
  occupation: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}
