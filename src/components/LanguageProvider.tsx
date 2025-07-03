
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    home: 'Home',
    wallets: 'Wallets',
    savings: 'Savings', 
    cards: 'Cards',
    profile: 'Profile',
    
    // Profile sections
    personalInfo: 'Personal Information',
    security: 'Security',
    ekyc: 'e-KYC',
    settings: 'Settings',
    compliance: 'Compliance',
    help: 'Help',
    
    // Common
    save: 'Save Changes',
    cancel: 'Cancel',
    confirm: 'Confirm',
    amount: 'Amount',
    withdraw: 'Withdraw',
    deposit: 'Deposit',
    send: 'Send',
    balance: 'Balance',
    transaction: 'Transaction',
    successful: 'Successful',
    
    // Forms
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    
    // Security
    changePassword: 'Change Password',
    oldPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    
    // Language
    language: 'Language',
    english: 'English',
    chichewa: 'Chichewa',
    tumbuka: 'Tumbuka',
    swahili: 'Swahili'
  },
  ny: {
    // Navigation
    home: 'Kwathu',
    wallets: 'Matumba',
    savings: 'Kusungitsa',
    cards: 'Makadi',
    profile: 'Mbiri',
    
    // Profile sections
    personalInfo: 'Zambiri Za Munthu',
    security: 'Chitetezo',
    ekyc: 'e-KYC',
    settings: 'Makonzedwe',
    compliance: 'Kutsatira Malamulo',
    help: 'Thandizo',
    
    // Common
    save: 'Sunga Zosintha',
    cancel: 'Lekani',
    confirm: 'Tsimikizani',
    amount: 'Ndalama',
    withdraw: 'Tulani',
    deposit: 'Ikani',
    send: 'Tumizani',
    balance: 'Ndalama Zomwe Zili',
    transaction: 'Kusintha Ndalama',
    successful: 'Kwatheka',
    
    // Forms
    firstName: 'Dzina Loyamba',
    lastName: 'Dzina Lomaliza',
    email: 'Imelo',
    phone: 'Nambala Ya Foni',
    address: 'Adilesi',
    
    // Security
    changePassword: 'Sintha Chinsinsi',
    oldPassword: 'Chinsinsi Chakale',
    newPassword: 'Chinsinsi Chatsopano',
    confirmPassword: 'Tsimikizani Chinsinsi',
    
    // Language
    language: 'Chilankhulo',
    english: 'Chingerezi',
    chichewa: 'Chichewa',
    tumbuka: 'Chitumbuka',
    swahili: 'Chiswahili'
  },
  tu: {
    // Navigation
    home: 'Kwitu',
    wallets: 'Vitumba',
    savings: 'Kusunga',
    cards: 'Makadi',
    profile: 'Umbiri',
    
    // Profile sections
    personalInfo: 'Vyakumundu',
    security: 'Chitetezo',
    ekyc: 'e-KYC',
    settings: 'Makonzeledwe',
    compliance: 'Kutsatira Malamulo',
    help: 'Uthandizo',
    
    // Common
    save: 'Sunga Vyosintha',
    cancel: 'Leka',
    confirm: 'Chisimikizge',
    amount: 'Ndalama',
    withdraw: 'Tulako',
    deposit: 'Ika',
    send: 'Tumizga',
    balance: 'Ndalama Zili',
    transaction: 'Kutembenuka',
    successful: 'Kwachinene',
    
    // Forms
    firstName: 'Lina Lyoyamba',
    lastName: 'Lina Lyomaliza',
    email: 'Imelo',
    phone: 'Nambala Ya Foni',
    address: 'Adilesi',
    
    // Security
    changePassword: 'Sintha Chinsinsi',
    oldPassword: 'Chinsinsi Chakale',
    newPassword: 'Chinsinsi Chatsopano',
    confirmPassword: 'Chitsimikizge Chinsinsi',
    
    // Language
    language: 'Chilangizo',
    english: 'Chingerezi',
    chichewa: 'Chichewa',
    tumbuka: 'Chitumbuka',
    swahili: 'Chiswahili'
  },
  sw: {
    // Navigation
    home: 'Nyumbani',
    wallets: 'Pochi',
    savings: 'Akiba',
    cards: 'Kadi',
    profile: 'Wasifu',
    
    // Profile sections
    personalInfo: 'Maelezo ya Kibinafsi',
    security: 'Usalama',
    ekyc: 'e-KYC',
    settings: 'Mipangilio',
    compliance: 'Utii',
    help: 'Msaada',
    
    // Common
    save: 'Hifadhi Mabadiliko',
    cancel: 'Ghairi',
    confirm: 'Thibitisha',
    amount: 'Kiasi',
    withdraw: 'Toa',
    deposit: 'Weka',
    send: 'Tuma',
    balance: 'Salio',
    transaction: 'Muamala',
    successful: 'Imefanikiwa',
    
    // Forms
    firstName: 'Jina la Kwanza',
    lastName: 'Jina la Mwisho',
    email: 'Barua Pepe',
    phone: 'Nambari ya Simu',
    address: 'Anwani',
    
    // Security
    changePassword: 'Badilisha Nywila',
    oldPassword: 'Nywila ya Zamani',
    newPassword: 'Nywila Mpya',
    confirmPassword: 'Thibitisha Nywila',
    
    // Language
    language: 'Lugha',
    english: 'Kiingereza',
    chichewa: 'Kichichewa',
    tumbuka: 'Kitumbuka',
    swahili: 'Kiswahili'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('app-language') || 'en';
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string): string => {
    const langCode = language === 'Chichewa' ? 'ny' : 
                     language === 'Tumbuka' ? 'tu' :
                     language === 'Swahili' ? 'sw' : 'en';
    return translations[langCode][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
