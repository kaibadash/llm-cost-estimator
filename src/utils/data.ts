import { LLMModel } from '@/types';
// CSVを直接importするための型宣言
import modelDataRaw from '@/data/llm_models.csv';

// 文字列として読み込まれたCSVを変数に格納
const modelData = modelDataRaw as string;

export async function getModelData(): Promise<LLMModel[]> {
  try {
    // CSVデータを解析して返す
    const lines = modelData.trim().split('\n');    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        provider: values[0],
        model: values[1],
        input_price: parseFloat(values[2]),
        output_price: parseFloat(values[3]),
        pricing_url: values[4]
      };
    });
  } catch (error) {
    console.error('Error loading model data:', error);
    return [];
  }
} 