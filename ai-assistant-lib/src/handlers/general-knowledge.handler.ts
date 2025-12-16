import { IntentHandler } from '../domain/interfaces/ai.interfaces';
import { Intent } from '../domain/types/ai.types';
import { AiProvider } from '../ports';
import { createGeneralKnowledgePrompt } from '../prompts/general-knowledge.prompt';

export class GeneralKnowledgeHandler implements IntentHandler {
  constructor(private readonly aiProvider: AiProvider) {}

  canHandle(intent: Intent): boolean {
    return intent === 'GENERAL_KNOWLEDGE';
  }

  async handle(query: string): Promise<string> {
    const prompt = createGeneralKnowledgePrompt(query);
    return this.aiProvider.getCompletion(prompt);
  }
}
