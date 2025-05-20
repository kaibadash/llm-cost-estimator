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
          <InputForm onCalculate={handleCalculate} translations={translations} />
          
          {results.length > 0 && (
            <ResultsTable results={results} translations={translations} />
          )}
        </div>
      </main>
    </div>
  );
}
