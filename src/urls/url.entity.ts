import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import { User } from '../users/user.entity';
import { AccessLog } from '../access-log/access-log.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUrl: string;

  @Column({ length: 6, unique: true })
  shortCode: string;

  @Column({ default: 0 })
  clicks: number;

  @ManyToOne(() => User, (user) => user.urls, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ nullable: true })
  ownerId: number | null;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AccessLog, (log) => log.url)
  accessLogs: AccessLog[];
}