import { AskAiAssistantDto } from '../dto/ask-ai-assistant.dto';
import { AiAssistantResponse } from './ai-assistant-response.interface';

export interface AiControllerInterface {
  askAssistant(prompt: AskAiAssistantDto): Promise<AiAssistantResponse>;
}
