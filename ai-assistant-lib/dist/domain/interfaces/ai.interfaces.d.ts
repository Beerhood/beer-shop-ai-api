import { Intent } from '../types/ai.types';
export interface AiAssistantResponse {
  message: string;
}
export interface AiController {
  askAssistant(prompt: string): Promise<AiAssistantResponse>;
}
export interface AiService {
  askSomething(prompt: string): Promise<AiAssistantResponse>;
}
export interface IntentHandler {
  canHandle(intent: Intent): boolean;
  handle(query: string): Promise<string>;
}
export interface BeerSearchCriteria {
  country?: string[];
  brand?: string[];
  details?: {
    style?: string[];
    minABV?: number;
    maxABV?: number;
    minIBU?: number;
    maxIBU?: number;
    OG?: number;
  };
}
export interface SnackSearchCriteria {
  country?: string[];
  brand?: string[];
  details?: {
    flavor?: string[];
  };
}
export interface IntentAnalysisResponse {
  intent: Intent;
  query: string;
}
//# sourceMappingURL=ai.interfaces.d.ts.map
