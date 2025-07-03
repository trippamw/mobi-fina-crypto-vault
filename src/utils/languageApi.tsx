
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
    save: 'Save',
    
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
    save: 'Sunga',
    
    // Send Money
    sendMoney: 'Tumiza Ndalama',
    recipientPhone: 'Nambala ya Foni ya Wolandila',
    selectProvider: 'Sankhani Kampani ya Mobile Money',
    transactionFee: 'Ndalama za Ntchito',
    total: 'Zonse',
    
    // Profile related
    personalInfo: 'Zambiri Za Munthu',
    security: 'Chitetezo',
    ekyc: 'e-KYC',
    settings: 'Makonzedwe',
    compliance: 'Kutsatira Malamulo',
    help: 'Thandizo',
    firstName: 'Dzina Loyamba',
    lastName: 'Dzina Lomaliza',
    email: 'Imelo',
    phone: 'Foni',
    address: 'Malo',
    dateOfBirth: 'Tsiku Lobadwa',
    nationality: 'Dziko',
    occupation: 'Ntchito',
    idNumber: 'Nambala ya ID',
    twoFactorAuth: 'Chitetezo Chachiwiri',
    pushNotifications: 'Zidziwitso',
    biometricLogin: 'Kulowa ndi Chidindo',
    loginAlerts: 'Zidziwitso za Kulowa',
    changePassword: 'Sintha Chinsinsi',
    addBiometric: 'Yika Chidindo',
    downloadStatement: 'Tsitsa Lipoti',
    termsAndConditions: 'Malamulo',
    privacyPolicy: 'Ndondomeko ya Chinsinsi',
    logout: 'Tuluka',
    profileSaved: 'Mbiri Yasungidwa',
    languageChanged: 'Chilankhulo Chasinthidwa',
    
    // Cards
    purchaseCard: 'Gula Kadi',
    addMoney: 'Yika Ndalama',
    cardSettings: 'Makonzedwe a Kadi',
    deleteCard: 'Chotsa Kadi',
    transactionSuccessful: 'Ntchito Yatheka',
    
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
    save: 'Sunga',
    
    // Send Money
    sendMoney: 'Tuma Mali',
    recipientPhone: 'Nambala ya Foni ya Waposhera',
    selectProvider: 'Sankhani Kampani ya Mobile Money',
    transactionFee: 'Mali gha Ntchito',
    total: 'Zose',
    
    // Profile related
    personalInfo: 'Vimanyisyo vya Munthu',
    security: 'Chitetezo',
    ekyc: 'e-KYC',
    settings: 'Vikongolesyo',
    compliance: 'Kukongolesya Malamulo',
    help: 'Thandizo',
    firstName: 'Zina Lyakubanja',
    lastName: 'Zina Lyapamtunda',
    email: 'Imelo',
    phone: 'Foni',
    address: 'Malo',
    dateOfBirth: 'Siku Lyamubanja',
    nationality: 'Dziko',
    occupation: 'Ntchito',
    idNumber: 'Nambala ya ID',
    twoFactorAuth: 'Chitetezo Chachiwili',
    pushNotifications: 'Vidziwitso',
    biometricLogin: 'Kulowa ni Chidindo',
    loginAlerts: 'Vidziwitso vya Kulowa',
    changePassword: 'Sintha Chinsinsi',
    addBiometric: 'Yika Chidindo',
    downloadStatement: 'Holola Lipoti',
    termsAndConditions: 'Malamulo',
    privacyPolicy: 'Ndondomeko ya Chinsinsi',
    logout: 'Tuluka',
    profileSaved: 'Chithunzi Chasungidwa',
    languageChanged: 'Chilololo Chasinthidwa',
    
    // Cards
    purchaseCard: 'Gula Kadi',
    addMoney: 'Yika Mali',
    cardSettings: 'Vikongolesyo vya Kadi',
    deleteCard: 'Chotsa Kadi',
    transactionSuccessful: 'Ntchito Yatheka',
    
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
    save: 'Hifadhi',
    
    // Send Money
    sendMoney: 'Tuma Pesa',
    recipientPhone: 'Nambari ya Simu ya Mpokeaji',
    selectProvider: 'Chagua Mtoa Huduma wa Mobile Money',
    transactionFee: 'Ada ya Muamala',
    total: 'Jumla',
    
    // Profile related
    personalInfo: 'Taarifa za Kibinafsi',
    security: 'Usalama',
    ekyc: 'e-KYC',
    settings: 'Mipangilio',
    compliance: 'Kufuata Sheria',
    help: 'Msaada',
    firstName: 'Jina la Kwanza',
    lastName: 'Jina la Mwisho',
    email: 'Barua Pepe',
    phone: 'Simu',
    address: 'Anwani',
    dateOfBirth: 'Tarehe ya Kuzaliwa',
    nationality: 'Utaifa',
    occupation: 'Kazi',
    idNumber: 'Nambari ya Kitambulisho',
    twoFactorAuth: 'Uthibitisho wa Hatua Mbili',
    pushNotifications: 'Arifa za Kusukuma',
    biometricLogin: 'Kuingia kwa Kibayometriki',
    loginAlerts: 'Arifa za Kuingia',
    changePassword: 'Badilisha Nenosiri',
    addBiometric: 'Ongeza Kibayometriki',
    downloadStatement: 'Pakua Taarifa',
    termsAndConditions: 'Masharti na Hali',
    privacyPolicy: 'Sera ya Faragha',
    logout: 'Ondoka',
    profileSaved: 'Wasifu Umehifadhiwa',
    languageChanged: 'Lugha Imebadilishwa',
    
    // Cards
    purchaseCard: 'Nunua Kadi',
    addMoney: 'Ongeza Pesa',
    cardSettings: 'Mipangilio ya Kadi',
    deleteCard: 'Futa Kadi',
    transactionSuccessful: 'Muamala Umefanikiwa',
    
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
      // Dispatch custom event for language change
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
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

// Alias for useLanguage to match the import in components
export const useTranslation = useLanguage;

// Helper functions for backward compatibility
export const translateText = (key: string, language: string = 'en'): string => {
  return translations[language]?.[key] || translations.en[key] || key;
};

export const getCurrentLanguage = (): string => {
  return localStorage.getItem('app-language') || 'en';
};

export const applyLanguageToApp = (language: string) => {
  if (translations[language]) {
    localStorage.setItem('app-language', language);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
  }
};

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ny', name: 'Chichewa', flag: '🇲🇼' },
  { code: 'tum', name: 'Tumbuka', flag: '🇲🇼' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
];
