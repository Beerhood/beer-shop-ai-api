import { IsNotEmpty, IsString } from 'class-validator';

export class AskAiAssistantDto {
  @IsString()
  @IsNotEmpty()
  text!: string;
}
