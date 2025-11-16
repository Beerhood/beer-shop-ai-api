import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { AskAiAssistantDto } from './dto/ask-ai-assistant.dto';
import { AiControllerInterface } from './interfaces/ai-controller.interface';

@Controller('ai')
export class AiController implements AiControllerInterface {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  askAssistant(@Body() prompt: AskAiAssistantDto) {
    return this.aiService.askSomething(prompt.text);
  }
}
