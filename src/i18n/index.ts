import { createI18n } from 'vue-i18n';
import { messages } from './messages';

export type AppLocale = keyof typeof messages;

const STORAGE_KEY = 'ohl-app-locale';
const supportedLocales: AppLocale[] = ['zh-CN', 'en-US'];

const readInitialLocale = (): AppLocale => {
  const stored = window.localStorage.getItem(STORAGE_KEY) as AppLocale | null;
  if (stored && supportedLocales.includes(stored)) return stored;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US';
};

export const i18n = createI18n({
  legacy: false,
  locale: readInitialLocale(),
  fallbackLocale: 'zh-CN',
  messages,
});

export const setAppLocale = (locale: AppLocale) => {
  i18n.global.locale.value = locale;
  window.localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
};

setAppLocale(i18n.global.locale.value as AppLocale);
