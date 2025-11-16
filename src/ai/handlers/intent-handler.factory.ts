import { Inject, Injectable } from '@nestjs/common';
import { IntentHandlerInterface } from '../interfaces/intent-handler.interface';
import { Intent } from '../ai.service';
import { INTENT_HANDLERS_TOKEN } from '../constants/ai.const';

@Injectable()
export class IntentHandlerFactory {
  constructor(
    @Inject(INTENT_HANDLERS_TOKEN)
    private readonly handlers: IntentHandlerInterface[],
  ) {}

  findHandler(intent: Intent): IntentHandlerInterface {
    const handler = this.handlers.find((h) => h.canHandle(intent));
    if (!handler) throw new Error(`No handler found for intent: ${intent}`);
    return handler;
  }
}
