'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.OffTopicHandler = void 0;
class OffTopicHandler {
  canHandle(intent) {
    return intent === 'OFF_TOPIC';
  }
  async handle(_query) {
    return Promise.resolve('{"WTF BRO!"}');
  }
}
exports.OffTopicHandler = OffTopicHandler;
//# sourceMappingURL=off-topic.handler.js.map
