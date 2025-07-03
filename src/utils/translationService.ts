
// Simple offline translation mappings
const translations: { [key: string]: { [key: string]: string } } = {
  en: {
    // Base English - no translation needed
  },
  ny: {
    // Chichewa translations
    home: 'Nyumba',
    send: 'Tumiza',
    receive: 'Landira',
    exchange: 'Sinthana',
    cards: 'Makadi',
    deposit: 'Yika',
    withdraw: 'Tulutsa',
    bills: 'Ngongole',
    invest: 'Yika ndalama',
    balance: 'Ndalama',
    amount: 'Kuchuluka',
    currency: 'Ndalama',
    total: 'Zonse',
    confirm: 'Tsimikiza',
    cancel: 'Lepheretsa',
    success: 'Zapambana',
    processing: 'Kukugwira ntchito...',
    wallet: 'Chikwama',
    addMoney: 'Onjezera ndalama'
  },
  tum: {
    // Tumbuka translations
    home: 'Koya',
    send: 'Tuma',
    receive: 'Pokera',
    exchange: 'Sintha',
    cards: 'Makadi',
    deposit: 'Vika',
    withdraw: 'Tula',
    bills: 'Ngongole',
    invest: 'Vika mali',
    balance: 'Mali',
    amount: 'Kuhala',
    currency: 'Mali',
    total: 'Vyose',
    confirm: 'Chakafika',
    cancel: 'Leka',
    success: 'Vyapambana',
    processing: 'Vikugwira ntchito...',
    wallet: 'Thumba',
    addMoney: 'Onjezghesko mali'
  },
  sw: {
    // Swahili translations
    home: 'Nyumbani',
    send: 'Tuma',
    receive: 'Pokea',
    exchange: 'Badilisha',
    cards: 'Kadi',
    deposit: 'Weka',
    withdraw: 'Toa',
    bills: 'Bili',
    invest: 'Wekeza',
    balance: 'Salio',
    amount: 'Kiasi',
    currency: 'Sarafu',
    total: 'Jumla',
    confirm: 'Thibitisha',
    cancel: 'Ghairi',
    success: 'Imefanikiwa',
    processing: 'Inachakatwa...',
    wallet: 'Pochi',
    addMoney: 'Ongeza pesa'
  }
};

export const translateText = (text: string, targetLanguage: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simple lookup in our translation dictionary
    const langTranslations = translations[targetLanguage];
    if (langTranslations && langTranslations[text.toLowerCase()]) {
      resolve(langTranslations[text.toLowerCase()]);
    } else {
      // Return original text if no translation found
      resolve(text);
    }
  });
};

export const translateMultipleTexts = (texts: string[], targetLanguage: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const translated = texts.map(text => {
      const langTranslations = translations[targetLanguage];
      if (langTranslations && langTranslations[text.toLowerCase()]) {
        return langTranslations[text.toLowerCase()];
      }
      return text;
    });
    resolve(translated);
  });
};

export const getLanguageCode = (language: string): string => {
  const languageMap: { [key: string]: string } = {
    'en': 'en',
    'ny': 'ny', // Chichewa
    'tum': 'tum', // Tumbuka  
    'sw': 'sw', // Swahili
  };
  return languageMap[language] || 'en';
};
