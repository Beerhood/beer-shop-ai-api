import { Injectable } from '@nestjs/common';
import { IntentHandlerInterface } from '../interfaces/intent-handler.interface';
import { Intent } from '../constants/ai.const';

@Injectable()
export class OffTopicHandler implements IntentHandlerInterface {
  canHandle(intent: Intent): boolean {
    return intent === 'OFF_TOPIC';
  }

  /*eslint-disable-next-line @typescript-eslint/require-await*/
  async handle(_query: string): Promise<string> {
    return 'WFT BRO!';
  }
}
