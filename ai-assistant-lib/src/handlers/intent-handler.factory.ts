import { IntentHandler } from '../domain/interfaces/ai.interfaces';
import { Intent } from '../domain/types/ai.types';

export class IntentHandlerFactory {
  constructor(private readonly handlers: IntentHandler[]) {}

  findHandler(intent: Intent): IntentHandler {
    const handler = this.handlers.find((h) => h.canHandle(intent));
    if (!handler) throw new Error(`No handler found for intent: ${intent}`);
    return handler;
  }
}
