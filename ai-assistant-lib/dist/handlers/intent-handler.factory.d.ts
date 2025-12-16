import { IntentHandler } from '../domain/interfaces/ai.interfaces';
import { Intent } from '../domain/types/ai.types';
export declare class IntentHandlerFactory {
  private readonly handlers;
  constructor(handlers: IntentHandler[]);
  findHandler(intent: Intent): IntentHandler;
}
//# sourceMappingURL=intent-handler.factory.d.ts.map
