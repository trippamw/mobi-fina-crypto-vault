
import React, { createContext, useContext, useState, useEffect } from 'react';
// Simplified translation service - removed external API dependency

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Base English translations
const baseTranslations: Translations = {
  en: {
    // Navigation
    home: 'Home',
    send: 'Send',
    receive: 'Receive',
    exchange: 'Exchange',
    cards: 'Cards',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    bills: 'Bills',
    invest: 'Invest',
    villageBank: 'Village Bank',
    
    // Common
    balance: 'Balance',
    amount: 'Amount',
    currency: 'Currency',
    submit: 'Submit',
    cancel: 'Cancel',
    confirm: 'Confirm',
    processing: 'Processing...',
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
    save: 'Save',
    wallet: 'Wallet',
    
    // Send Money
    sendMoney: 'Send Money',
    recipientPhone: 'Recipient Phone Number',
    selectProvider: 'Select Mobile Money Provider',
    transactionFee: 'Transaction Fee',
    total: 'Total',
    
    // Profile related
    personalInfo: 'Personal Info',
    security: 'Security',
    ekyc: 'e-KYC',
    settings: 'Settings',
    compliance: 'Compliance',
    help: 'Help',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    dateOfBirth: 'Date of Birth',
    nationality: 'Nationality',
    occupation: 'Occupation',
    idNumber: 'ID Number',
    twoFactorAuth: 'Two-Factor Authentication',
    pushNotifications: 'Push Notifications',
    biometricLogin: 'Biometric Login',
    loginAlerts: 'Login Alerts',
    changePassword: 'Change Password',
    addBiometric: 'Add Biometric',
    downloadStatement: 'Download Statement',
    termsAndConditions: 'Terms and Conditions',
    privacyPolicy: 'Privacy Policy',
    logout: 'Logout',
    profileSaved: 'Profile Saved',
    languageChanged: 'Language Changed',
    
    // Cards
    purchaseCard: 'Purchase Card',
    addMoney: 'Add Money',
    cardSettings: 'Card Settings',
    deleteCard: 'Delete Card',
    transactionSuccessful: 'Transaction Successful',
    
    // Language Settings
    language: 'Language',
    english: 'English',
    chichewa: 'Chichewa',
    tumbuka: 'Tumbuka',
    swahili: 'Swahili',
    
    // Additional common terms
    back: 'Back',
    next: 'Next',
    done: 'Done',
    close: 'Close',
    open: 'Open',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    update: 'Update',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    all: 'All',
    none: 'None',
    select: 'Select',
    clear: 'Clear',
    reset: 'Reset',
    apply: 'Apply'
  }
};

// Dynamic translations cache
let dynamicTranslations: Translations = { ...baseTranslations };

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => Promise<void>;
  t: (key: string) => string;
  translateDynamically: (text: string, targetLang: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const translateDynamically = async (text: string, targetLang: string): Promise<string> => {
    // Simplified - return original text
    return text;
  };

  const setLanguage = async (lang: string) => {
    if (lang === currentLanguage) return;
    
    setIsTranslating(true);
    setCurrentLanguage(lang);
    localStorage.setItem('app-language', lang);

    // If switching to non-English, use English as fallback (translation service removed)
    if (lang !== 'en' && !dynamicTranslations[lang]) {
      dynamicTranslations[lang] = { ...baseTranslations.en };
    }

    setIsTranslating(false);
    
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  };

  const t = (key: string): string => {
    if (isTranslating) return '...'; // Show loading state during translation
    
    return dynamicTranslations[currentLanguage]?.[key] || 
           dynamicTranslations.en[key] || 
           key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, translateDynamically, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Alias for useLanguage to match the import in components
export const useTranslation = useLanguage;

// Helper functions for backward compatibility
export const translateTextStatic = (key: string, language: string = 'en'): string => {
  return dynamicTranslations[language]?.[key] || dynamicTranslations.en[key] || key;
};

export const getCurrentLanguage = (): string => {
  return localStorage.getItem('app-language') || 'en';
};

export const applyLanguageToApp = async (language: string) => {
  localStorage.setItem('app-language', language);
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
};

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ny', name: 'Chichewa', flag: '🇲🇼' },
  { code: 'tum', name: 'Tumbuka', flag: '🇲🇼' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
];
