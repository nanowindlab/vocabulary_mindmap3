export const DEFAULT_TRANSLATION_LANGUAGE = "영어";

export const TARGET_TRANSLATION_LANGUAGES = [
  "영어",
  "몽골어",
  "아랍어",
  "중국어",
  "베트남어",
  "타이어",
  "일본어",
  "프랑스어",
  "스페인어",
  "러시아어",
  "인도네시아어",
];

const LANGUAGE_SLUGS = {
  "영어": "en",
  "몽골어": "mn",
  "아랍어": "ar",
  "중국어": "zh",
  "베트남어": "vi",
  "타이어": "th",
  "일본어": "ja",
  "프랑스어": "fr",
  "스페인어": "es",
  "러시아어": "ru",
  "인도네시아어": "id",
};

export function getTranslationLanguageSlug(language) {
  return LANGUAGE_SLUGS[language] || null;
}

export function getTranslationOverlayFileName(language) {
  const slug = getTranslationLanguageSlug(language);
  if (!slug) return null;
  return `APP_READY_TRANSLATIONS_${slug}.json`;
}
