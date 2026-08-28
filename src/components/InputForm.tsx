'use client';

import { useState, useEffect } from 'react';
import { TranslationStrings } from '@/types';

// サンプルは日英翻訳の実例。UI言語に関わらず同じ文面を使う。
// 翻訳タスクでは入出力トークン量がほぼ釣り合うため、入出力の単価差を比較する題材として分かりやすい。
const SAMPLE_INPUT = `次の日本語を英語に翻訳してください。翻訳文のみを出力し、前置きや解説は不要です。

弊社の新サービスは、社内に散在するドキュメントを横断的に検索できるようにするものです。導入時に既存のアクセス権限をそのまま引き継ぐため、ユーザーごとに閲覧できる範囲が変わることはありません。まずは30日間の無料トライアルをお試しください。`;

const SAMPLE_OUTPUT = `Our new service lets you search across the documents scattered throughout your company. It inherits your existing access permissions on deployment, so the range of content each user can view stays exactly the same. Start with a 30-day free trial.`;

interface InputFormProps {
  onCalculate: (inputText: string, outputText: string, requestCount: number) => void;
  translations: TranslationStrings;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  isCalculating?: boolean;
}

export default function InputForm({ onCalculate, translations, inputTokens = 0, outputTokens = 0, totalTokens = 0, isCalculating = false }: InputFormProps) {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [requestCount, setRequestCount] = useState<number>(1);

  // Automatically run calculation after the user stops typing for 1 second (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      onCalculate(inputText, outputText, requestCount);
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputText, outputText, requestCount]); // Removed onCalculate from dependency array

  // 明示的な計算呼び出しはしない。state 更新で上の debounce が走り、手入力と同じ経路で再計算される。
  const handleLoadSample = () => {
    setInputText(SAMPLE_INPUT);
    setOutputText(SAMPLE_OUTPUT);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">{translations.inputSection.title}</h2>
        <button
          type="button"
          onClick={handleLoadSample}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-900 hover:bg-gray-100"
        >
          {translations.inputSection.loadSample}
        </button>
      </div>

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
        {isCalculating && (
          <div className="flex items-center gap-1 text-gray-500">
            {/* Tailwind だけでスピナーを作るため、上辺のみ透明にした円形ボーダーを回している */}
            <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <span>{translations.resultsSection.calculating}</span>
          </div>
        )}
      </div>
    </div>
  );
}
