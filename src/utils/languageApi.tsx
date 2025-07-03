
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
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
    profile: 'Profile',
    
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
    
    // Send Money
    sendMoney: 'Send Money',
    recipientPhone: 'Recipient Phone Number',
    selectProvider: 'Select Mobile Money Provider',
    transactionFee: 'Transaction Fee',
    total: 'Total',
    
    // Language Settings
    language: 'Language',
    english: 'English',
    chichewa: 'Chichewa',
    tumbuka: 'Tumbuka',
    swahili: 'Swahili',
  },
  ny: { // Chichewa
    // Navigation
    home: 'Nyumba',
    send: 'Tumiza',
    receive: 'Landila',
    exchange: 'Sinthani',
    cards: 'Makadi',
    deposit: 'Yika Ndalama',
    withdraw: 'Tulutsa',
    bills: 'Ngongole',
    invest: 'Yika Bizinesi',
    villageBank: 'Banki ya Mudzi',
    profile: 'Mbiri',
    
    // Common
    balance: 'Ndalama Zomwe Zili',
    amount: 'Ndalama',
    currency: 'Mtundu wa Ndalama',
    submit: 'Tumiza',
    cancel: 'Leka',
    confirm: 'Tsimikiza',
    processing: 'Zikuchitika...',
    success: 'Zachitika',
    error: 'Cholakwika',
    loading: 'Zikukwera...',
    
    // Send Money
    sendMoney: 'Tumiza Ndalama',
    recipientPhone: 'Nambala ya Foni ya Wolandila',
    selectProvider: 'Sankhani Kampani ya Mobile Money',
    transactionFee: 'Ndalama za Ntchito',
    total: 'Zonse',
    
    // Language Settings
    language: 'Chilankhulo',
    english: 'Chingerezi',
    chichewa: 'Chichewa',
    tumbuka: 'Chitumbuka',
    swahili: 'Chiswahili',
  },
  tum: { // Tumbuka
    // Navigation
    home: 'Kunyumba',
    send: 'Tuma',
    receive: 'Poshera',
    exchange: 'Sinthana',
    cards: 'Makadi',
    deposit: 'Yika Mali',
    withdraw: 'Holola',
    bills: 'Ngongole',
    invest: 'Yika pa Bizinesi',
    villageBank: 'Banki ya Mudzi',
    profile: 'Chithunzi',
    
    // Common
    balance: 'Mali Ghakukhalapo',
    amount: 'Mali',
    currency: 'Mtundu wa Mali',
    submit: 'Tuma',
    cancel: 'Siya',
    confirm: 'Chakaka',
    processing: 'Yikuchitika...',
    success: 'Yachitika',
    error: 'Cholakwika',
    loading: 'Yikukwera...',
    
    // Send Money
    sendMoney: 'Tuma Mali',
    recipientPhone: 'Nambala ya Foni ya Waposhera',
    selectProvider: 'Sankhani Kampani ya Mobile Money',
    transactionFee: 'Mali gha Ntchito',
    total: 'Zose',
    
    // Language Settings
    language: 'Chilololo',
    english: 'Chingerezi',
    chichewa: 'Chichewa',
    tumbuka: 'Chitumbuka',
    swahili: 'Kiswahili',
  },
  sw: { // Swahili
    // Navigation
    home: 'Nyumbani',
    send: 'Tuma',
    receive: 'Pokea',
    exchange: 'Badilisha',
    cards: 'Kadi',
    deposit: 'Weka Pesa',
    withdraw: 'Toa',
    bills: 'Bili',
    invest: 'Wekeza',
    villageBank: 'Benki ya Kijiji',
    profile: 'Wasifu',
    
    // Common
    balance: 'Salio',
    amount: 'Kiasi',
    currency: 'Sarafu',
    submit: 'Wasilisha',
    cancel: 'Ghairi',
    confirm: 'Thibitisha',
    processing: 'Inachakatwa...',
    success: 'Imefanikiwa',
    error: 'Hitilafu',
    loading: 'Inapakia...',
    
    // Send Money
    sendMoney: 'Tuma Pesa',
    recipientPhone: 'Nambari ya Simu ya Mpokeaji',
    selectProvider: 'Chagua Mtoa Huduma wa Mobile Money',
    transactionFee: 'Ada ya Muamala',
    total: 'Jumla',
    
    // Language Settings
    language: 'Lugha',
    english: 'Kiingereza',
    chichewa: 'Kichewa',
    tumbuka: 'Kitumbuka',
    swahili: 'Kiswahili',
  },
};

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
      localStorage.setItem('app-language', lang);
    }
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
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

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ny', name: 'Chichewa', flag: '🇲🇼' },
  { code: 'tum', name: 'Tumbuka', flag: '🇲🇼' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
];
