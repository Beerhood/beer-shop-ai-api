import { AiAssistantResponse } from './ai-assistant-res.interface';
import { AskAiAssistantDto } from '../dto/ask-ai-assistant.dto';

export interface AiController {
  askAssistant(prompt: AskAiAssistantDto): Promise<AiAssistantResponse>;
}
