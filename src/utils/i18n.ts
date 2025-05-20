import { Language, TranslationStrings } from '@/types';
import enTranslations from '@/i18n/en.json';
import jaTranslations from '@/i18n/ja.json';

export const translations: Record<Language, TranslationStrings> = {
  en: enTranslations as TranslationStrings,
  ja: jaTranslations as TranslationStrings,
};

export function getDefaultLanguage(): Language {
  // クライアントサイドでのみ実行
  if (typeof window !== 'undefined') {
    const browserLang = window.navigator.language.split('-')[0];
    return browserLang === 'ja' ? 'ja' : 'en';
  }
  return 'en'; // サーバーサイドのデフォルト
}

export function getTranslations(lang: Language): TranslationStrings {
  return translations[lang] || translations.en;
} 