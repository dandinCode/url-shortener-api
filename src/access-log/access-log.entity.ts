import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn,
} from 'typeorm';
import { Url } from '../urls/url.entity';

@Entity()
export class AccessLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ip: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    region: string;

    @Column({ nullable: true })
    country: string;

    @Column({ type: 'float', nullable: true })
    latitude: number;

    @Column({ type: 'float', nullable: true })
    longitude: number;

    @Column({ nullable: true })
    os: string;

    @Column({ nullable: true })
    browser: string;

    @Column()
    userAgent: string;

    @CreateDateColumn()
    accessedAt: Date;

    @Column({ nullable: true })
    device: string;

    @ManyToOne(() => Url, (url) => url.accessLogs)
    url: Url;
}
