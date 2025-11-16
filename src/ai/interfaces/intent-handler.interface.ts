import { Intent } from '../ai.service';

export interface IntentHandlerInterface {
  canHandle(intent: Intent): boolean;
  handle(query: string): Promise<string>;
}
