import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Url } from '../urls/url.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Url, url => url.user)
  urls: Url[];
}
