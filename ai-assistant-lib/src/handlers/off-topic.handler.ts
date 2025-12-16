import { IntentHandler } from '../domain/interfaces/ai.interfaces';
import { Intent } from '../domain/types/ai.types';

export class OffTopicHandler implements IntentHandler {
  canHandle(intent: Intent): boolean {
    return intent === 'OFF_TOPIC';
  }

  async handle(_query: string): Promise<string> {
    return Promise.resolve('{"WTF BRO!"}');
  }
}
