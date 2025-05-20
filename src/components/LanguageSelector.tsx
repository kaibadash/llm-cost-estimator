'use client';

import { Language, TranslationStrings } from '@/types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  translations: TranslationStrings;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  translations
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm text-gray-600">{translations.languageSelector.label}:</span>
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="p-1 text-sm border border-gray-300 rounded-md"
      >
        <option value="en">{translations.languageSelector.en}</option>
        <option value="ja">{translations.languageSelector.ja}</option>
      </select>
    </div>
  );
} 