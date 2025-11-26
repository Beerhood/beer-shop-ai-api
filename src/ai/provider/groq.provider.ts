import { AiProviderInterface } from './ai-provider.interface';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from '../../config/configuration';
import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class GroqProvider implements AiProviderInterface {
  private groqClient: Groq;
  constructor(private readonly configService: ConfigService<AppConfiguration>) {
    const groqConfig = this.configService.get('groq', { infer: true })!;
    this.groqClient = new Groq({ apiKey: groqConfig.apiKey });
  }

  async getCompletion(prompt: string): Promise<string> {
    try {
      const completion = await this.groqClient.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });
      return this.validateJson(completion.choices[0]?.message?.content);
    } catch {
      throw new Error('Failed to get a response from the AI provider.');
    }
  }

  private validateJson(content: string | null): string {
    if (!content) throw new Error('AI provider returned an empty response.');
    try {
      JSON.parse(content);
    } catch {
      throw new Error('AI provider returned a malformed JSON response.');
    }
    return content;
  }
}
