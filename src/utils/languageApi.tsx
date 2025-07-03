
export interface LanguageTranslations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: LanguageTranslations = {
  en: {
    // Navigation
    home: 'Home',
    wallet: 'Wallet',
    exchange: 'Exchange',
    save: 'Save',
    profile: 'Profile',
    
    // Main sections
    totalPortfolio: 'Total Portfolio',
    deposit: 'Deposit',
    send: 'Send',
    withdraw: 'Withdraw',
    receive: 'Receive',
    cards: 'Cards',
    invest: 'Invest',
    invite: 'Invite',
    
    // Profile sections
    personalInfo: 'Personal Information',
    security: 'Security',
    ekyc: 'e-KYC',
    settings: 'Settings',
    compliance: 'Compliance',
    help: 'Help',
    
    // Form fields
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    dateOfBirth: 'Date of Birth',
    nationality: 'Nationality',
    occupation: 'Occupation',
    idNumber: 'ID Number',
    language: 'Language',
    
    // Actions
    saveChanges: 'Save Changes',
    logout: 'Logout',
    changePassword: 'Change Password',
    uploadDocument: 'Upload Document',
    downloadStatement: 'Download Statement',
    
    // Security
    twoFactorAuth: 'Two-Factor Authentication',
    biometricLogin: 'Biometric Login',
    pushNotifications: 'Push Notifications',
    loginAlerts: 'Login Alerts',
    
    // Transactions
    sendMoney: 'Send Money',
    amount: 'Amount',
    recipient: 'Recipient',
    transactionFee: 'Transaction Fee',
    total: 'Total',
    processing: 'Processing...',
    
    // Success messages
    transactionSuccessful: 'Transaction Successful',
    passwordChanged: 'Password Changed Successfully',
    profileSaved: 'Profile Saved Successfully',
    
    // Crypto
    bitcoinAddress: 'Bitcoin Address',
    ethereumAddress: 'Ethereum Address',
    cryptoDeposit: 'Crypto Deposit',
    cryptoWithdraw: 'Crypto Withdraw',
    
    // Cards
    virtualCard: 'Virtual Card',
    physicalCard: 'Physical Card',
    cardSettings: 'Card Settings',
    addMoney: 'Add Money',
    
    // Compliance
    kycVerification: 'KYC Verification',
    complianceStatus: 'Compliance Status',
    verified: 'Verified',
    pending: 'Pending',
    
    // Village Bank
    villageBankAdmin: 'Village Bank Admin',
    loanRequests: 'Loan Requests',
    approveLoan: 'Approve Loan',
    declineLoan: 'Decline Loan',
  },
  
  ny: { // Chichewa
    // Navigation
    home: 'Nyumba',
    wallet: 'Chikwama',
    exchange: 'Kusinthanitsa',
    save: 'Kusunga',
    profile: 'Mbiri',
    
    // Main sections
    totalPortfolio: 'Ndalama Zonse',
    deposit: 'Kuyika',
    send: 'Kutumiza',
    withdraw: 'Kutulutsa',
    receive: 'Kulandira',
    cards: 'Makadi',
    invest: 'Kusunga',
    invite: 'Kuitana',
    
    // Profile sections
    personalInfo: 'Zambiri Za Munthu',
    security: 'Chitetezo',
    ekyc: 'Kudziwa Makasitomala',
    settings: 'Makonzedwe',
    compliance: 'Kutsatira Malamulo',
    help: 'Thandizo',
    
    // Form fields
    firstName: 'Dzina Loyamba',
    lastName: 'Dzina Lomaliza',
    email: 'Imelo',
    phone: 'Nambala Ya Foni',
    address: 'Adilesi',
    dateOfBirth: 'Tsiku Lobadwa',
    nationality: 'Dziko',
    occupation: 'Ntchito',
    idNumber: 'Nambala Ya ID',
    language: 'Chilankhulo',
    
    // Actions
    saveChanges: 'Sunga Zosintha',
    logout: 'Tuluka',
    changePassword: 'Sintha Chinsinsi',
    uploadDocument: 'Kweza Chikalata',
    downloadStatement: 'Tsitsa Malipoti',
    
    // Security
    twoFactorAuth: 'Chitetezo Cha Magawo Awiri',
    biometricLogin: 'Kulowa Ndi Biometric',
    pushNotifications: 'Zidziwitso',
    loginAlerts: 'Zidziwitso Za Kulowa',
    
    // Transactions
    sendMoney: 'Tumiza Ndalama',
    amount: 'Kuchuluka',
    recipient: 'Wolandira',
    transactionFee: 'Malipiro',
    total: 'Zonse',
    processing: 'Kukwaniritsa...',
    
    // Success messages
    transactionSuccessful: 'Kutumiza Kwatheka',
    passwordChanged: 'Chinsinsi Chasinthidwa',
    profileSaved: 'Mbiri Yasungidwa',
    
    // Crypto
    bitcoinAddress: 'Adilesi Ya Bitcoin',
    ethereumAddress: 'Adilesi Ya Ethereum',
    cryptoDeposit: 'Kuyika Crypto',
    cryptoWithdraw: 'Kutulutsa Crypto',
    
    // Cards
    virtualCard: 'Kadi Yopanda Thupi',
    physicalCard: 'Kadi Yeniyeni',
    cardSettings: 'Makonzedwe A Kadi',
    addMoney: 'Onjezera Ndalama',
    
    // Compliance
    kycVerification: 'Kutsimikizira KYC',
    complianceStatus: 'Momwe Ziliri',
    verified: 'Wotsimikiziridwa',
    pending: 'Akudikira',
    
    // Village Bank
    villageBankAdmin: 'Woyang\'anira Banki Ya Mudzi',
    loanRequests: 'Mapemphero A Ngongole',
    approveLoan: 'Vomereza Ngongole',
    declineLoan: 'Kana Ngongole',
  },
  
  tu: { // Tumbuka
    // Navigation
    home: 'Kaya',
    wallet: 'Thumba',
    exchange: 'Kusinthana',
    save: 'Kusunga',
    profile: 'Mbiri',
    
    // Main sections
    totalPortfolio: 'Mali Ghose',
    deposit: 'Kuvika',
    send: 'Kutumizga',
    withdraw: 'Kutulutsa',
    receive: 'Kulandira',
    cards: 'Makadi',
    invest: 'Kusunga',
    invite: 'Kuyitana',
    
    // Profile sections
    personalInfo: 'Viyangu Vya Munthu',
    security: 'Chitetezo',
    ekyc: 'Kudziwa Makasitomala',
    settings: 'Vikongolozo',
    compliance: 'Kugonjera Malamulo',
    help: 'Thandizo',
    
    // Form fields
    firstName: 'Zina Lyoyamba',
    lastName: 'Zina Lyomaliza',
    email: 'Imelo',
    phone: 'Nambala Ya Foni',
    address: 'Adilesi',
    dateOfBirth: 'Siku Lyakubadwa',
    nationality: 'Charu',
    occupation: 'Ntchito',
    idNumber: 'Nambala Ya ID',
    language: 'Chilyankhulo',
    
    // Actions
    saveChanges: 'Sunga Visintha',
    logout: 'Tuluka',
    changePassword: 'Sintha Chinsinsi',
    uploadDocument: 'Kweza Chikalata',
    downloadStatement: 'Tsitsa Malipoti',
    
    // Security
    twoFactorAuth: 'Chitetezo Cha Magawo Ghawiri',
    biometricLogin: 'Kulowa Ndi Biometric',
    pushNotifications: 'Vidziwitso',
    loginAlerts: 'Vidziwitso Vya Kulowa',
    
    // Transactions
    sendMoney: 'Tumizga Mali',
    amount: 'Kuchuluka',
    recipient: 'Wolandira',
    transactionFee: 'Malipilo',
    total: 'Vyose',
    processing: 'Vikukwanilitska...',
    
    // Success messages
    transactionSuccessful: 'Kutumizga Kwatheka',
    passwordChanged: 'Chinsinsi Chasinthidwa',
    profileSaved: 'Mbiri Yasungidwa',
    
    // Crypto
    bitcoinAddress: 'Adilesi Ya Bitcoin',
    ethereumAddress: 'Adilesi Ya Ethereum',
    cryptoDeposit: 'Kuvika Crypto',
    cryptoWithdraw: 'Kutulutsa Crypto',
    
    // Cards
    virtualCard: 'Kadi Yopanda Thupi',
    physicalCard: 'Kadi Yeniyeni',
    cardSettings: 'Vikongolozo Vya Kadi',
    addMoney: 'Onjezera Mali',
    
    // Compliance
    kycVerification: 'Kutsimikizira KYC',
    complianceStatus: 'Momwe Viliri',
    verified: 'Wotsimikiziridwa',
    pending: 'Akudikira',
    
    // Village Bank
    villageBankAdmin: 'Woyang\'anira Banki Ya Mudzi',
    loanRequests: 'Mapemphero Gha Ngongole',
    approveLoan: 'Vomereza Ngongole',
    declineLoan: 'Kana Ngongole',
  },
  
  sw: { // Swahili
    // Navigation
    home: 'Nyumbani',
    wallet: 'Pochi',
    exchange: 'Kubadilishana',
    save: 'Kuhifadhi',
    profile: 'Wasifu',
    
    // Main sections
    totalPortfolio: 'Jumla ya Mali',
    deposit: 'Kuweka',
    send: 'Kutuma',
    withdraw: 'Kutoa',
    receive: 'Kupokea',
    cards: 'Kadi',
    invest: 'Kuhifadhi',
    invite: 'Kualika',
    
    // Profile sections
    personalInfo: 'Maelezo ya Kibinafsi',
    security: 'Usalama',
    ekyc: 'Utambulisho wa Mteja',
    settings: 'Mipangilio',
    compliance: 'Utii',
    help: 'Msaada',
    
    // Form fields
    firstName: 'Jina la Kwanza',
    lastName: 'Jina la Mwisho',
    email: 'Barua Pepe',
    phone: 'Nambari ya Simu',
    address: 'Anwani',
    dateOfBirth: 'Tarehe ya Kuzaliwa',
    nationality: 'Uraia',
    occupation: 'Kazi',
    idNumber: 'Nambari ya Kitambulisho',
    language: 'Lugha',
    
    // Actions
    saveChanges: 'Hifadhi Mabadiliko',
    logout: 'Ondoka',
    changePassword: 'Badilisha Nenosiri',
    uploadDocument: 'Pakia Hati',
    downloadStatement: 'Pakua Taarifa',
    
    // Security
    twoFactorAuth: 'Uthibitisho wa Hatua Mbili',
    biometricLogin: 'Kuingia kwa Biometric',
    pushNotifications: 'Arifa za Kusonga',
    loginAlerts: 'Arifa za Kuingia',
    
    // Transactions
    sendMoney: 'Tuma Pesa',
    amount: 'Kiasi',
    recipient: 'Mpokeaji',
    transactionFee: 'Ada ya Muamala',
    total: 'Jumla',
    processing: 'Inachakatishwa...',
    
    // Success messages
    transactionSuccessful: 'Muamala Umefanikiwa',
    passwordChanged: 'Nenosiri Limebadilishwa',
    profileSaved: 'Wasifu Umehifadhiwa',
    
    // Crypto
    bitcoinAddress: 'Anwani ya Bitcoin',
    ethereumAddress: 'Anwani ya Ethereum',
    cryptoDeposit: 'Kuweka Crypto',
    cryptoWithdraw: 'Kutoa Crypto',
    
    // Cards
    virtualCard: 'Kadi ya Kidijitali',
    physicalCard: 'Kadi ya Kimwili',
    cardSettings: 'Mipangilio ya Kadi',
    addMoney: 'Ongeza Pesa',
    
    // Compliance
    kycVerification: 'Uthibitisho wa KYC',
    complianceStatus: 'Hali ya Utii',
    verified: 'Imethibitishwa',
    pending: 'Inasubiri',
    
    // Village Bank
    villageBankAdmin: 'Msimamizi wa Benki ya Kijiji',
    loanRequests: 'Maombi ya Mkopo',
    approveLoan: 'Idhinisha Mkopo',
    declineLoan: 'Kataa Mkopo',
  }
};

export const translateText = (key: string, language: string): string => {
  const langCode = language.toLowerCase();
  const translationKey = langCode === 'chichewa' ? 'ny' : 
                        langCode === 'tumbuka' ? 'tu' : 
                        langCode === 'swahili' ? 'sw' : 'en';
  
  return translations[translationKey]?.[key] || translations.en[key] || key;
};

export const applyLanguageToApp = (language: string) => {
  // Store language preference
  localStorage.setItem('preferredLanguage', language);
  
  // Update document language
  const langCode = language.toLowerCase() === 'chichewa' ? 'ny' : 
                  language.toLowerCase() === 'tumbuka' ? 'tu' : 
                  language.toLowerCase() === 'swahili' ? 'sw' : 'en';
  
  document.documentElement.lang = langCode;
  
  // Trigger app-wide re-render by dispatching custom event
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
};

export const getCurrentLanguage = (): string => {
  return localStorage.getItem('preferredLanguage') || 'English';
};
