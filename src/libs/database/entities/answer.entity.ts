import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { QuestionEntity } from './question.entity';

@Entity('answers')
export class AnswerEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    text!: string;

    @Column()
    questionId!: number;

    @OneToOne(() => QuestionEntity, (post: QuestionEntity) => post.id)
    question!: QuestionEntity

    @Column()
    createById!: number;

    @OneToOne(() => UserEntity, (user: UserEntity) => user.id)
    createdBy!: UserEntity

    @Column()
    totalVotes!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updateAt?: Date;

    @DeleteDateColumn()
    deleteAt?: Date;
}
