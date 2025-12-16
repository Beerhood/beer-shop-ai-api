import { IntentHandler } from '../domain/interfaces/ai.interfaces';
import { Intent } from '../domain/types/ai.types';
import { AiProvider } from '../ports';
export declare class GeneralKnowledgeHandler implements IntentHandler {
  private readonly aiProvider;
  constructor(aiProvider: AiProvider);
  canHandle(intent: Intent): boolean;
  handle(query: string): Promise<string>;
}
//# sourceMappingURL=general-knowledge.handler.d.ts.map
