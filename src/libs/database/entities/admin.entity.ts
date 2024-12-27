import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admins')
export class AdminEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    password?: string;
}