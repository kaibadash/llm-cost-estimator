'use client';

import React, { useState, useEffect } from "react";
import InputForm from "@/components/InputForm";
import ResultsTable from "@/components/ResultsTable";
import LanguageSelector from "@/components/LanguageSelector";
import { getModelData } from "@/utils/data";
import { countTokens, calculateCostFromTokens } from "@/utils/tokenizer";
import { getDefaultLanguage, getTranslations } from "@/utils/i18n";
import { Language, ModelCostEstimate } from "@/types";

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState(getTranslations(language));
  const [results, setResults] = useState<ModelCostEstimate[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
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
    setIsCalculating(true);
    try {
      // トークン化はモデルに依存しないので入出力それぞれ1回だけ行う。
      // モデルごとに数えると同じテキストをモデル数だけ encode することになる。
      const [models, inputTokens, outputTokens] = await Promise.all([
        getModelData(),
        countTokens(inputText),
        countTokens(outputText)
      ]);
      const totalTokens = inputTokens + outputTokens;

      setTokenCounts({ inputTokens, outputTokens, totalTokens });
      setResults(models.map((model) => ({
        ...model,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost: calculateCostFromTokens(
          inputTokens,
          outputTokens,
          model.input_price,
          model.output_price,
          requestCount
        )
      })));
    } finally {
      setIsCalculating(false);
    }
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
            isCalculating={isCalculating}
          />
          
          {results.length > 0 && (
            <div className={isCalculating ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
              <ResultsTable results={results} translations={translations} />
            </div>
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
