import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { bn } from './bn.js';
import { en } from './en.js';
import { formatNumerals } from './numerals.js';

const STORAGE_KEY = 'nirapod_language';
const LanguageContext = createContext(null);

/**
 * Provider component that maintains selected language and provides translation helper.
 * @param {object} props - Component props containing children.
 * @returns {JSX.Element} Context provider wrapping children.
 */
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'en' ? 'en' : 'bn';
    } catch {
      return 'bn';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [language]);

  const setLanguage = (lang) => {
    if (lang === 'bn' || lang === 'en') {
      setLanguageState(lang);
    }
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const dictionaries = useMemo(() => ({ bn, en }), []);

  const t = useMemo(() => {
    return (key) => {
      const dict = dictionaries[language] || bn;
      return dict[key] !== undefined ? dict[key] : (bn[key] !== undefined ? bn[key] : key);
    };
  }, [language, dictionaries]);

  const num = useMemo(() => {
    return (value) => formatNumerals(value, language);
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t, num }),
    [language, t, num]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access active translation function, numeral formatter, and language state.
 * @returns {{ t: Function, num: Function, language: string, setLanguage: Function, toggleLanguage: Function }}
 */
export function useT() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useT must be used within a LanguageProvider');
  }
  return context;
}
