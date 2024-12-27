import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true, select: false })
    hashedRefreshToken?: string;
}
