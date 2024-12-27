import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { EditType } from '../enum/edit-type.enum';
import { EditStatus } from '../enum/edit-status.enum';

@Entity('edit_requests')
export class EditRequestEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: EditType })
    targetType!: EditType;

    @Column()
    targetId!: number;

    @Column()
    proposedChanges!: string;

    @Column({ default: EditStatus.pending, type: 'enum', enum: EditStatus })
    status!: EditStatus;

    @Column({ nullable: true })
    adminComment?: string;

    @Column()
    requestedById!: number;

    @ManyToOne(() => UserEntity, (user) => user.id)
    requestedBy!: UserEntity;

    @CreateDateColumn()
    createdAt!: Date;
}