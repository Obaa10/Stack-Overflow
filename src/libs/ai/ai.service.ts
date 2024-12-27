import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AIService {
    private client: OpenAI;

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env['OPENAI_API_KEY'],
        });
    }

    async generateAnswer(question: string): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: 'text-davinci-003',
            messages: [{ role: 'user', content: `Provide a detailed and concise answer to the following question:\n\n${question}` }],
            max_tokens: 150,
        });

        return response.choices[0]?.message?.content.trim() || 'No answer generated.';
    }
}