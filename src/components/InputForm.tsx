'use client';

import { useState, useEffect } from 'react';
import { TranslationStrings } from '@/types';

interface InputFormProps {
  onCalculate: (inputText: string, outputText: string, requestCount: number) => void;
  translations: TranslationStrings;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export default function InputForm({ onCalculate, translations, inputTokens = 0, outputTokens = 0, totalTokens = 0 }: InputFormProps) {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [requestCount, setRequestCount] = useState<number>(1);

  // Automatically run calculation whenever input changes
  useEffect(() => {
    onCalculate(inputText, outputText, requestCount);
  }, [inputText, outputText, requestCount]); // Removed onCalculate from dependency array

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{translations.inputSection.title}</h2>
      
      <div className="mb-4">
        <label htmlFor="inputText" className="block text-sm font-medium text-gray-900 mb-1">
          {translations.inputSection.promptInput}
        </label>
        <textarea
          id="inputText"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-32 p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-600"
          placeholder="Tell me about artificial intelligence..."
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="outputText" className="block text-sm font-medium text-gray-900 mb-1">
          {translations.inputSection.promptOutput}
        </label>
        <textarea
          id="outputText"
          value={outputText}
          onChange={(e) => setOutputText(e.target.value)}
          className="w-full h-32 p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-600"
          placeholder="Artificial intelligence (AI) refers to..."
        />
      </div>
      
      <div className="mb-2">
        <label htmlFor="requestCount" className="block text-sm font-medium text-gray-900 mb-1">
          {translations.inputSection.requestCount}
        </label>
        <input
          id="requestCount"
          type="number"
          min="1"
          value={requestCount}
          onChange={(e) => setRequestCount(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
        />
      </div>

      <div className="flex space-x-4 text-sm text-gray-700 mb-2">
        <div>{translations.resultsSection.inputTokens}: {inputTokens}</div>
        <div>{translations.resultsSection.outputTokens}: {outputTokens}</div>
        <div>{translations.resultsSection.totalTokens}: {totalTokens}</div>
      </div>
    </div>
  );
} 