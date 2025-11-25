import { Intent } from '../constants/ai.const';

export interface IntentHandlerInterface {
  canHandle(intent: Intent): boolean;
  handle(query: string): Promise<string>;
}
