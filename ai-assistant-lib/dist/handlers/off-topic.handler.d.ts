import { IntentHandler } from '../domain/interfaces/ai.interfaces';
import { Intent } from '../domain/types/ai.types';
export declare class OffTopicHandler implements IntentHandler {
  canHandle(intent: Intent): boolean;
  handle(_query: string): Promise<string>;
}
//# sourceMappingURL=off-topic.handler.d.ts.map
