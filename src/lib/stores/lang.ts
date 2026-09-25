import { writable } from 'svelte/store';
import { languageTag, setLanguageTag } from '$lib/paraglide/runtime.js';
import { browser } from '$app/environment';

// Initialize synchronously on the client side
if (browser) {
  const savedLang = localStorage.getItem('preferred-language');
  if (savedLang) {
    setLanguageTag(savedLang as any);
    document.documentElement.lang = savedLang;
  } else {
    document.documentElement.lang = languageTag();
  }
}

export const currentLang = writable(languageTag());

export function changeLanguage(lang: string) {
  setLanguageTag(lang as any);
  currentLang.set(lang as any);
  if (browser) {
    localStorage.setItem('preferred-language', lang);
    document.documentElement.lang = lang;
  }
}
