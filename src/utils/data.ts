import { LLMModel } from '@/types';
// Type declaration for direct CSV import
import modelDataRaw from '@/data/llm_models.csv';

// Store CSV loaded as string in variable
const modelData = modelDataRaw as string;

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
        pricing_url: values[4]
      };
    });
  } catch (error) {
    console.error('Error loading model data:', error);
    return [];
  }
} 