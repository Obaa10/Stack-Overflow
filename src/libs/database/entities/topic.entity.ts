import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('topics')
export class TopicEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
}
