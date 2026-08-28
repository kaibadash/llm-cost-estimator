import type { Tiktoken } from 'js-tiktoken/lite';

// インスタンスではなく Promise をキャッシュする。ロード中に別の呼び出しが来ても
// 1.6MB の ranks を二重に import せず、同じ初期化を待たせるため。
let tokenizerPromise: Promise<Tiktoken> | null = null;

// Initialize class for token calculation
function initTokenizer(): Promise<Tiktoken> {
  if (!tokenizerPromise) {
    tokenizerPromise = (async () => {
      const [{ Tiktoken }, { default: cl100k_base }] = await Promise.all([
        import('js-tiktoken/lite'),
        import('js-tiktoken/ranks/cl100k_base'),
      ]);
      // cl100k_base is the encoding used by GPT-4 / GPT-3.5-Turbo.
      // The constructor expects a TiktokenBPE rank object, not the encoding name.
      return new Tiktoken(cl100k_base);
    })();
  }
  return tokenizerPromise;
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

// トークン数を引数で受け取る同期関数にしてある。モデルごとに呼ばれるため、
// ここでトークン化するとモデル数だけ同じテキストを encode してしまう。
export function calculateCostFromTokens(
  inputTokens: number,
  outputTokens: number,
  inputPrice: number,
  outputPrice: number,
  requestCount: number
): number {
  // 1000トークンあたりの価格から実際のコストを計算
  const inputCost = (inputTokens / 1000) * inputPrice;
  const outputCost = (outputTokens / 1000) * outputPrice;
  return (inputCost + outputCost) * requestCount;
}
