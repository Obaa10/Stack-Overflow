import { Injectable, OnModuleInit } from '@nestjs/common';
import { TfIdf } from 'natural';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from 'src/libs/database/entities/question.entity';

@Injectable()
export class SearchSimilarQuestionsService implements OnModuleInit {
    private tfidf: TfIdf;

    constructor(
        @InjectRepository(QuestionEntity)
        private readonly questionRepository: Repository<QuestionEntity>,
    ) {
        this.tfidf = new TfIdf();
    }

    async onModuleInit() {
        const questions = await this.questionRepository.find();

        questions.forEach((question) => {
            this.tfidf.addDocument(question.title + ' ' + question.description, question.id.toString());
        });
    }

    async searchSimilarQuestion(query: string): Promise<QuestionEntity[]> {
        const similarQuestionIds = await this.searchSimilarQuestionIds(query)
        return await this.questionRepository.find({ where: { id: In(similarQuestionIds) } });
    }

    async searchSimilarQuestionIds(query: string): Promise<number[]> {
        const results: { id: string; score: number }[] = [];

        this.tfidf.tfidfs(query, (docId, score) => {
            results.push({ id: docId.toString(), score });
        });

        results.sort((a, b) => b.score - a.score);

        return results
            .filter((result) => result.score > 0)
            .map((result) => parseInt(result.id));
    }

    async addQuestionToTFIDF(question: QuestionEntity) {
        this.tfidf.addDocument(question.title + ' ' + question.description, question.id.toString());
    }
}