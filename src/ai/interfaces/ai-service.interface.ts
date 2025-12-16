import { AiAssistantResponse } from './ai-assistant-res.interface';

export interface AiService {
  askSomething(prompt: string): Promise<AiAssistantResponse>;
}
