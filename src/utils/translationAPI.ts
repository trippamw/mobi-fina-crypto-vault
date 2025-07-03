
interface GoogleTranslateResponse {
  data: {
    translations: {
      translatedText: string;
    }[];
  };
}

const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyCS59olq48K-W8PfqKValBHqVPayeapEKA';
const GOOGLE_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (targetLanguage === 'en') return text;
  
  try {
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data: GoogleTranslateResponse = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

export const translateMultipleTexts = async (texts: string[], targetLanguage: string): Promise<string[]> => {
  if (targetLanguage === 'en') return texts;
  
  try {
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: texts,
        target: targetLanguage,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data: GoogleTranslateResponse = await response.json();
    return data.data.translations.map(translation => translation.translatedText);
  } catch (error) {
    console.error('Translation error:', error);
    return texts; // Return original texts if translation fails
  }
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
