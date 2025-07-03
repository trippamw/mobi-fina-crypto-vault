
import React, { createContext, useContext, useState, useEffect } from 'react';

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

// Static translations for better performance and reliability
const translations = {
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
    
    // Transaction types
    sent: 'Sent',
    received: 'Received',
    depositTx: 'Deposit',
    withdrawal: 'Withdrawal',
    exchangeTx: 'Exchange',
    investment: 'Investment',
    
    // Additional terms
    totalBalance: 'Total Balance',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    addMoney: 'Add Money',
    language: 'Language',
    settings: 'Settings'
  },
  ny: {
    // Navigation
    home: 'Kunyumba',
    send: 'Kutumiza',
    receive: 'Kulandira',
    exchange: 'Kusinthana',
    cards: 'Makadi',
    deposit: 'Kuika',
    withdraw: 'Kutulutsa',
    bills: 'Ngongole',
    invest: 'Kugulitsa',
    villageBank: 'Banki ya Mudzi',
    
    // Common
    balance: 'Ndalama',
    amount: 'Kuchuluka',
    currency: 'Ndalama',
    submit: 'Kutumiza',
    cancel: 'Kusiya',
    confirm: 'Kutsimikiza',
    processing: 'Kugwira ntchito...',
    success: 'Kupambana',
    error: 'Cholakwika',
    loading: 'Kutsegula...',
    save: 'Kusunga',
    wallet: 'Chikwama',
    
    // Transaction types
    sent: 'Atumizidwa',
    received: 'Alandidwa',
    depositTx: 'Kuika',
    withdrawal: 'Kutulutsa',
    exchangeTx: 'Kusinthana',
    investment: 'Kugulitsa',
    
    // Additional terms
    totalBalance: 'Ndalama Zonse',
    quickActions: 'Zochita Mwachangu',
    recentActivity: 'Zomwe Zachitika Posachedwa',
    addMoney: 'Kuwonjezera Ndalama',
    language: 'Chilankhulo',
    settings: 'Zosintha'
  },
  tum: {
    // Navigation
    home: 'Kunyumba',
    send: 'Kutumira',
    receive: 'Kulipira',
    exchange: 'Kusinthanitsa',
    cards: 'Makadi',
    deposit: 'Kuika',
    withdraw: 'Kutulutsa',
    bills: 'Ngongole',
    invest: 'Kugulitsa',
    villageBank: 'Banki ya Mudzi',
    
    // Common
    balance: 'Ndalama',
    amount: 'Kuchuluka',
    currency: 'Ndalama',
    submit: 'Kutumira',
    cancel: 'Kusiya',
    confirm: 'Kutsimikiza',
    processing: 'Kugwira ntchito...',
    success: 'Kupambana',
    error: 'Cholakwika',
    loading: 'Kutsegula...',
    save: 'Kusunga',
    wallet: 'Chikwama',
    
    // Transaction types
    sent: 'Atumizidwa',
    received: 'Alandidwa',
    depositTx: 'Kuika',
    withdrawal: 'Kutulutsa',
    exchangeTx: 'Kusinthanitsa',
    investment: 'Kugulitsa',
    
    // Additional terms
    totalBalance: 'Ndalama Zonse',
    quickActions: 'Zochita Mwachangu',
    recentActivity: 'Zomwe Zachitika Posachedwa',
    addMoney: 'Kuwonjezera Ndalama',
    language: 'Chilankhulo',
    settings: 'Zosintha'
  },
  sw: {
    // Navigation
    home: 'Nyumbani',
    send: 'Tuma',
    receive: 'Pokea',
    exchange: 'Kubadilisha',
    cards: 'Kadi',
    deposit: 'Weka',
    withdraw: 'Toa',
    bills: 'Bili',
    invest: 'Uwekezaji',
    villageBank: 'Benki ya Kijiji',
    
    // Common
    balance: 'Mizani',
    amount: 'Kiasi',
    currency: 'Sarafu',
    submit: 'Wasilisha',
    cancel: 'Ghairi',
    confirm: 'Thibitisha',
    processing: 'Inachakata...',
    success: 'Mafanikio',
    error: 'Hitilafu',
    loading: 'Inapakia...',
    save: 'Hifadhi',
    wallet: 'Mkoba',
    
    // Transaction types
    sent: 'Imetumwa',
    received: 'Imepokelewa',
    depositTx: 'Amana',
    withdrawal: 'Utoaji',
    exchangeTx: 'Kubadilisha',
    investment: 'Uwekezaji',
    
    // Additional terms
    totalBalance: 'Jumla ya Mizani',
    quickActions: 'Vitendo vya Haraka',
    recentActivity: 'Shughuli za Hivi Karibuni',
    addMoney: 'Ongeza Fedha',
    language: 'Lugha',
    settings: 'Mipangilio'
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang as keyof typeof translations]) {
      setCurrentLanguage(lang);
      localStorage.setItem('app-language', lang);
    }
  };

  const t = (key: string): string => {
    const currentTranslations = translations[currentLanguage as keyof typeof translations] || translations.en;
    return currentTranslations[key as keyof typeof currentTranslations] || key;
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const useLanguage = useTranslation;

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ny', name: 'Chichewa', flag: '🇲🇼' },
  { code: 'tum', name: 'Tumbuka', flag: '🇲🇼' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
];
