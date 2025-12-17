import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { AskAiAssistantDto } from './dto/ask-ai-assistant.dto';
import { AiController as AiControllerInterface } from './interfaces/ai-controller.interface';
import { AiAssistantResponse } from './interfaces/ai-assistant-res.interface';

@Controller('ai')
export class AiController implements AiControllerInterface {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  askAssistant(@Body() prompt: AskAiAssistantDto): Promise<AiAssistantResponse> {
    return this.aiService.askSomething(prompt.text);
  }
}
