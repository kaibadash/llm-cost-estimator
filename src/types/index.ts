export type Language = 'en' | 'ja';

export interface LLMModel {
  provider: string;
  model: string;
  input_price: number;
  output_price: number;
  max_input_tokens: number | null;
  max_output_tokens: number | null;
  pricing_url: string;
  deprecated: boolean;
  shutdown_date: string | null;
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
    loadSample: string;
  };
  resultsSection: {
    title: string;
    provider: string;
    model: string;
    inputPrice: string;
    outputPrice: string;
    maxInputTokens: string;
    maxOutputTokens: string;
    shutdownDate: string;
    deprecatedDateUnknown: string;
    estimatedCost: string;
    pricingLink: string;
    inputTokens: string;
    outputTokens: string;
    totalTokens: string;
    sortBy: string;
    calculating: string;
  };
  languageSelector: {
    label: string;
    en: string;
    ja: string;
  };
} 