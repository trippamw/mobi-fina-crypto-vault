
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translateText, translateMultipleTexts, getLanguageCode } from './translationService';

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
    apply: 'Apply',
    
    // Transaction types
    sent: 'Sent',
    received: 'Received',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    exchange: 'Exchange',
    investment: 'Investment',
    purchase: 'Purchase',
    payment: 'Payment',
    transfer: 'Transfer',
    fee: 'Fee',
    bonus: 'Bonus',
    reward: 'Reward',
    
    // Status
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    active: 'Active',
    inactive: 'Inactive',
    enabled: 'Enabled',
    disabled: 'Disabled',
    
    // Time periods
    minute: 'minute',
    minutes: 'minutes',
    hour: 'hour',
    hours: 'hours',
    day: 'day',
    days: 'days',
    week: 'week',
    weeks: 'weeks',
    month: 'month',
    months: 'months',
    year: 'year',
    years: 'years',
    ago: 'ago',
    justNow: 'Just now',
    
    // Actions
    copyCode: 'Copy Code',
    shareLink: 'Share Link',
    downloadApp: 'Download App',
    contactSupport: 'Contact Support',
    reportIssue: 'Report Issue',
    giveFeedback: 'Give Feedback',
    rateApp: 'Rate App',
    invite: 'Invite',
    refer: 'Refer',
    earnReward: 'Earn Reward',
    
    // Notifications
    notificationTitle: 'Notification',
    newMessage: 'New Message',
    transactionAlert: 'Transaction Alert',
    securityAlert: 'Security Alert',
    systemUpdate: 'System Update',
    maintenance: 'Maintenance',
    
    // Cards and Payments
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    cardholderName: 'Cardholder Name',
    billingAddress: 'Billing Address',
    virtualCard: 'Virtual Card',
    physicalCard: 'Physical Card',
    
    // Investment and Savings
    savingsGoal: 'Savings Goal',
    targetAmount: 'Target Amount',
    currentAmount: 'Current Amount',
    progress: 'Progress',
    interestRate: 'Interest Rate',
    maturityDate: 'Maturity Date',
    riskLevel: 'Risk Level',
    expectedReturn: 'Expected Return',
    
    // Village Bank
    groupName: 'Group Name',
    members: 'Members',
    totalSavings: 'Total Savings',
    monthlyContribution: 'Monthly Contribution',
    loanAmount: 'Loan Amount',
    repaymentPeriod: 'Repayment Period',
    joinGroup: 'Join Group',
    createGroup: 'Create Group',
    leaveGroup: 'Leave Group',
    
    // Recent Activity
    recentActivity: 'Recent Activity',
    transactionHistory: 'Transaction History',
    viewAll: 'View All',
    noTransactions: 'No Transactions',
    noActivity: 'No Activity',
    
    // Quick Actions
    quickActions: 'Quick Actions',
    sendMoney: 'Send Money',
    requestMoney: 'Request Money',
    payBills: 'Pay Bills',
    buyAirtime: 'Buy Airtime',
    
    // Errors and Messages
    errorOccurred: 'An error occurred',
    tryAgain: 'Try Again',
    networkError: 'Network Error',
    serverError: 'Server Error',
    invalidInput: 'Invalid Input',
    requiredField: 'This field is required',
    insufficientFunds: 'Insufficient Funds',
    transactionFailed: 'Transaction Failed',
    transactionSuccessful: 'Transaction Successful',
    operationSuccessful: 'Operation Successful',
    
    // Form labels
    enterAmount: 'Enter Amount',
    selectWallet: 'Select Wallet',
    choosePaymentMethod: 'Choose Payment Method',
    addNote: 'Add Note',
    optional: 'Optional',
    required: 'Required'
  }
};

// Dynamic translations cache
let dynamicTranslations: Translations = { ...baseTranslations };

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  translateDynamically: (text: string, targetLang: string) => Promise<string>;
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
    if (targetLang === 'en') return text;
    
    try {
      const translatedText = await translateText(text, getLanguageCode(targetLang));
      return translatedText;
    } catch (error) {
      console.error('Dynamic translation error:', error);
      return text;
    }
  };

  const setLanguage = async (lang: string) => {
    if (lang === currentLanguage) return;
    
    setIsTranslating(true);
    setCurrentLanguage(lang);
    localStorage.setItem('app-language', lang);

    // If switching to non-English, translate all base texts
    if (lang !== 'en' && !dynamicTranslations[lang]) {
      try {
        const englishTexts = Object.values(baseTranslations.en);
        const translatedTexts = await translateMultipleTexts(englishTexts, getLanguageCode(lang));
        
        const translatedMap: { [key: string]: string } = {};
        Object.keys(baseTranslations.en).forEach((key, index) => {
          translatedMap[key] = translatedTexts[index] || baseTranslations.en[key];
        });
        
        dynamicTranslations[lang] = translatedMap;
      } catch (error) {
        console.error('Bulk translation error:', error);
        // Fallback to English
        dynamicTranslations[lang] = { ...baseTranslations.en };
      }
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
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, translateDynamically }}>
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
