import fetch from 'node-fetch';

export class TranslationHelper {
  static async translate(
    text: string,
    toLang = 'fr',
    fromLang = 'en',
  ): Promise<string> {
    if (!text || typeof text !== 'string') return text;

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text,
    )}&langpair=${fromLang}|${toLang}`;

    try {
      const response = await fetch(url);
      interface TranslationApiResponse {
        responseData?: {
          translatedText?: string;
        };
        [key: string]: any;
      }
      const data = (await response.json()) as unknown as TranslationApiResponse;
      return data?.responseData?.translatedText || text;
    } catch (error) {
      console.error('Erreur de traduction (helper) :', error);
      return text;
    }
  }
}
