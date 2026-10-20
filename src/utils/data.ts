import { LLMModel } from '@/types';
// Type declaration for direct CSV import
import modelDataRaw from '@/data/llm_models.csv';

// Store CSV loaded as string in variable
const modelData = modelDataRaw as string;

function parseTokenLimit(value: string): number | null {
  if (!value || value === '-') return null;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

// 廃止告知はあるが停止日が未発表のモデルもあるため、列は日付専用にせず `yes` も受け付ける
function parseDeprecated(value: string | undefined): { deprecated: boolean; shutdown_date: string | null } {
  if (!value || value === '-') return { deprecated: false, shutdown_date: null };
  return { deprecated: true, shutdown_date: /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null };
}

export async function getModelData(): Promise<LLMModel[]> {
  try {
    // Parse and return CSV data
    const lines = modelData.trim().split('\n');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        provider: values[0],
        model: values[1],
        input_price: parseFloat(values[2]),
        output_price: parseFloat(values[3]),
        max_input_tokens: parseTokenLimit(values[4]),
        max_output_tokens: parseTokenLimit(values[5]),
        pricing_url: values[6],
        ...parseDeprecated(values[7])
      };
    });
  } catch (error) {
    console.error('Error loading model data:', error);
    return [];
  }
}