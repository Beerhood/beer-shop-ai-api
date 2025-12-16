'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.IntentHandlerFactory = void 0;
class IntentHandlerFactory {
  constructor(handlers) {
    this.handlers = handlers;
  }
  findHandler(intent) {
    const handler = this.handlers.find((h) => h.canHandle(intent));
    if (!handler) throw new Error(`No handler found for intent: ${intent}`);
    return handler;
  }
}
exports.IntentHandlerFactory = IntentHandlerFactory;
//# sourceMappingURL=intent-handler.factory.js.map
