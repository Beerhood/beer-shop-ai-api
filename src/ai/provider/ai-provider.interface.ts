export interface AiProviderInterface {
  getCompletion(prompt: string): Promise<string>;
}
