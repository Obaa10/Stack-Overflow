export class QuestionDto {
    id: number;
    title: string;
    description: string;
    createdBy: { id: number; firstName?: string };
    topics?: { id: number; name: string }[];
    totalVotes: number;
    createdAt!: Date;
    updatedAt?: Date;
}