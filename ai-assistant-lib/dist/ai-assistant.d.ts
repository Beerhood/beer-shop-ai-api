import { AiProvider, ProductFinder } from './ports';
import { AiAssistantResponse } from './domain/interfaces/ai.interfaces';
export declare class AiAssistant {
  private readonly aiProvider;
  private readonly handlerFactory;
  constructor(aiProvider: AiProvider, productFinder: ProductFinder);
  ask(userPrompt: string): Promise<AiAssistantResponse>;
  private analyzeIntent;
}
//# sourceMappingURL=ai-assistant.d.ts.map
