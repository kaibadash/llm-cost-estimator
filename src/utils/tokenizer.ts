import { Tiktoken } from 'js-tiktoken';

let tokenizer: Tiktoken | null = null;

// Initialize class for token calculation
async function initTokenizer() {
  if (!tokenizer) {
    const { Tiktoken } = await import('js-tiktoken');
    tokenizer = new Tiktoken(
      // cl100k_base is the encoding used by latest models like GPT-4, GPT-3.5-Turbo
      'cl100k_base'
    );
  }
  return tokenizer;
}

export async function countTokens(text: string): Promise<number> {
  if (!text) return 0;
  
  try {
    const tiktoken = await initTokenizer();
    const tokens = tiktoken.encode(text);
    return tokens.length;
  } catch (error) {
    console.error('Error counting tokens:', error);
    // Fallback: rough estimation based on word count
    return Math.ceil(text.split(/\s+/).length * 1.3);
  }
}

export async function calculateCost(
  inputText: string, 
  outputText: string, 
  inputPrice: number, 
  outputPrice: number,
  requestCount: number
): Promise<{
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
}> {
  const inputTokens = await countTokens(inputText);
  const outputTokens = await countTokens(outputText);
  const totalTokens = inputTokens + outputTokens;
  
  // 1000トークンあたりの価格から実際のコストを計算
  const inputCost = (inputTokens / 1000) * inputPrice;
  const outputCost = (outputTokens / 1000) * outputPrice;
  const totalCost = (inputCost + outputCost) * requestCount;
  
  return {
    inputTokens,
    outputTokens,
    totalTokens,
    cost: totalCost
  };
} 