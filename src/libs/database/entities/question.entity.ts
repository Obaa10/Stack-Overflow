import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { AnswerEntity } from './answer.entity';
import { TopicEntity } from './topic.entity';

@Entity('questions')
export class QuestionEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column()
    createById!: number;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.id)
    createdBy: UserEntity

    @Column()
    totalVotes: number;

    @OneToMany(() => AnswerEntity, (comment: AnswerEntity) => comment.questionId)
    answers: AnswerEntity[]

    @ManyToMany(() => TopicEntity)
    @JoinTable()
    topics?: TopicEntity[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;

}
