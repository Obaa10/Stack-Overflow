import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Unique,
    Check,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { QuestionEntity } from './question.entity';
import { AnswerEntity } from './answer.entity';

@Entity('votes')
@Unique(['userId', 'questionId', 'answerId'])
@Check(`("questionId" IS NOT NULL AND "answerId" IS NULL) OR ("answerId" IS NOT NULL AND "questionId" IS NULL)`)
export class VoteEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
    user!: UserEntity;

    @Column({ nullable: true })
    questionId?: number;

    @ManyToOne(() => QuestionEntity, (question) => question.id, { nullable: true, onDelete: 'CASCADE' })
    question?: QuestionEntity;

    @Column({ nullable: true })
    answerId?: number;

    @ManyToOne(() => AnswerEntity, (answer) => answer.id, { nullable: true, onDelete: 'CASCADE' })
    answer?: AnswerEntity;

    @Column({ type: 'int' }) // +1 for upvote, -1 for downvote
    vote!: number;

    @CreateDateColumn()
    createdAt!: Date;
}