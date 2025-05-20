'use client';

import React, { useState, useEffect } from "react";
import InputForm from "@/components/InputForm";
import ResultsTable from "@/components/ResultsTable";
import LanguageSelector from "@/components/LanguageSelector";
import { getModelData } from "@/utils/data";
import { calculateCost } from "@/utils/tokenizer";
import { getDefaultLanguage, getTranslations } from "@/utils/i18n";
import { Language, ModelCostEstimate } from "@/types";

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState(getTranslations(language));
  const [results, setResults] = useState<ModelCostEstimate[]>([]);
  const [tokenCounts, setTokenCounts] = useState({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0
  });

  useEffect(() => {
    // Only execute on client-side
    setLanguage(getDefaultLanguage());
  }, []);

  useEffect(() => {
    setTranslations(getTranslations(language));
  }, [language]);

  const handleCalculate = async (inputText: string, outputText: string, requestCount: number) => {
    const models = await getModelData();
    
    const costEstimates = await Promise.all(
      models.map(async (model) => {
        const { inputTokens, outputTokens, totalTokens, cost } = await calculateCost(
          inputText,
          outputText,
          model.input_price,
          model.output_price,
          requestCount
        );
        
        // Update token counts at the first calculation
        if (model === models[0]) {
          setTokenCounts({
            inputTokens,
            outputTokens,
            totalTokens
          });
        }
        
        return {
          ...model,
          inputTokens,
          outputTokens,
          totalTokens,
          estimatedCost: cost
        };
      })
    );
    
    setResults(costEstimates);
  };

  return (
    <div className="min-h-screen px-4 py-6 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{translations.title}</h1>
          <LanguageSelector 
            currentLanguage={language}
            onLanguageChange={setLanguage}
            translations={translations}
          />
        </div>
        
        <p className="mb-6">
          {translations.description}
        </p>
        
        <div className="space-y-6">
          <InputForm 
            onCalculate={handleCalculate} 
            translations={translations} 
            inputTokens={tokenCounts.inputTokens} 
            outputTokens={tokenCounts.outputTokens} 
            totalTokens={tokenCounts.totalTokens} 
          />
          
          {results.length > 0 && (
            <ResultsTable results={results} translations={translations} />
          )}
        </div>
      </main>
      <footer className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
        <a 
          href="https://github.com/kaibadash/llm-cost-estimator" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-gray-700 hover:underline"
        >
          GitHub: kaibadash/llm-cost-estimator
        </a>
      </footer>
    </div>
  );
}
