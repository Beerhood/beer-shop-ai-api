import { AiAssistantResponse } from './ai-assistant-response.interface';

export interface AiServiceInterface {
  askSomething(prompt: string): Promise<AiAssistantResponse>;
}
