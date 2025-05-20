export type Language = 'en' | 'ja';

export interface LLMModel {
  provider: string;
  model: string;
  input_price: number;
  output_price: number;
  pricing_url: string;
}

export interface ModelCostEstimate extends LLMModel {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface TranslationStrings {
  title: string;
  description: string;
  inputSection: {
    title: string;
    promptInput: string;
    promptOutput: string;
    requestCount: string;
    calculate: string;
  };
  resultsSection: {
    title: string;
    provider: string;
    model: string;
    inputPrice: string;
    outputPrice: string;
    estimatedCost: string;
    pricingLink: string;
    inputTokens: string;
    outputTokens: string;
    totalTokens: string;
    sortBy: string;
  };
  languageSelector: {
    label: string;
    en: string;
    ja: string;
  };
} 