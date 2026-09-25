/**
 * Maps Choseong (Initial Consonants) indices to QWERTY keys.
 * Contains 19 initial consonants.
 * Uppercase letters require the Shift key (e.g., 'R' is Shift + r for ㄲ).
 */
export const CHO_QWERTY = [
  'r', 'R', 's', 'e', 'E', 'f', 'a', 'q', 'Q', 't', 'T', 'd', 'w', 'W', 'c', 'z', 'x', 'v', 'g'
];

/**
 * Maps Jungseong (Vowels) indices to QWERTY keys.
 * Contains 21 central vowels.
 * Compound vowels like ㅘ are typed as 'h' (ㅗ) + 'k' (ㅏ) = 'hk'.
 */
export const JUNG_QWERTY = [
  'k', 'o', 'i', 'O', 'j', 'p', 'u', 'P', 'h', 'hk', 'ho', 'hl', 'y', 'n', 'nj', 'np', 'nl', 'b', 'm', 'ml', 'l'
];

/**
 * Maps Jongseong (Final Consonants / Batchim) indices to QWERTY keys.
 * Contains 28 final consonants (index 0 is empty/no batchim).
 * Compound batchims like ㄶ are typed as 's' (ㄴ) + 'g' (ㅎ) = 'sg'.
 */
export const JONG_QWERTY = [
  '', 'r', 'R', 'rt', 's', 'sw', 'sg', 'e', 'f', 'fr', 'fa', 'fq', 'ft', 'fx', 'fv', 'fg', 'a', 'q', 'qt', 't', 'T', 'd', 'w', 'c', 'z', 'x', 'v', 'g'
];

/**
 * Unicode constants for the Hangul block.
 */
const HANGUL_BASE = 0xAC00; // '가'
const HANGUL_END = 0xD7A3;  // '힣'
const JUNG_COUNT = 21;
const JONG_COUNT = 28;

/**
 * Decomposes a Korean text string into the exact sequence of QWERTY keys
 * required to type it using the 2-Set layout.
 * 
 * @param text - Korean text (e.g., "한국")
 * @returns Array of QWERTY characters (e.g., ['g', 'k', 's', 'r', 'n', 'r'])
 */
export function decomposeToQwerty(text: string): string[] {
  const sequence: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    // Full Hangul syllable (e.g., 가, 한, 국)
    if (code >= HANGUL_BASE && code <= HANGUL_END) {
      const syllableIndex = code - HANGUL_BASE;
      
      const choIndex = Math.floor(syllableIndex / (JUNG_COUNT * JONG_COUNT));
      const jungIndex = Math.floor((syllableIndex % (JUNG_COUNT * JONG_COUNT)) / JONG_COUNT);
      const jongIndex = syllableIndex % JONG_COUNT;

      // Extract QWERTY keys and append to sequence
      sequence.push(...CHO_QWERTY[choIndex].split(''));
      sequence.push(...JUNG_QWERTY[jungIndex].split(''));
      if (jongIndex > 0) {
        sequence.push(...JONG_QWERTY[jongIndex].split(''));
      }
    } 
    // If not a full syllable, it might be an isolated Jamo (e.g., ㄱ, ㅏ)
    // For MVP simplicity, we map spaces directly
    else if (char === ' ') {
      sequence.push(' ');
    }
  }

  return sequence;
}

/**
 * Visual Jamo mappings matching the exact indices of CHO, JUNG, and JONG.
 */
const VISUAL_CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const VISUAL_JUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const VISUAL_JONG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

export interface DecomposedSyllable {
  char: string;
  cho: { jamo: string, keys: string };
  jung: { jamo: string, keys: string };
  jong: { jamo: string, keys: string } | null;
}

/**
 * Mathematically breaks down a single Hangul syllable into its 3 Jamo components
 * and their respective QWERTY keys for the visualizer.
 */
export function decomposeSyllable(char: string): DecomposedSyllable | null {
  if (char.length !== 1) return null;
  const code = char.charCodeAt(0);
  if (code < HANGUL_BASE || code > HANGUL_END) return null;

  const syllableIndex = code - HANGUL_BASE;
  const choIndex = Math.floor(syllableIndex / (JUNG_COUNT * JONG_COUNT));
  const jungIndex = Math.floor((syllableIndex % (JUNG_COUNT * JONG_COUNT)) / JONG_COUNT);
  const jongIndex = syllableIndex % JONG_COUNT;

  return {
    char,
    cho: { jamo: VISUAL_CHO[choIndex], keys: CHO_QWERTY[choIndex] },
    jung: { jamo: VISUAL_JUNG[jungIndex], keys: JUNG_QWERTY[jungIndex] },
    jong: jongIndex > 0 ? { jamo: VISUAL_JONG[jongIndex], keys: JONG_QWERTY[jongIndex] } : null
  };
}

import * as Hangul from 'hangul-js';
import { qwertyToJamo } from '../keyboard/layout';

/**
 * Renders the real-time visual progress of a Korean string being typed.
 * Assembles Hangul blocks directly from the typed QWERTY sequence, including errors!
 */
export function renderLiveComposition(typedKeys: string[]): string {
  if (typedKeys.length === 0) return '';
  const jamos = typedKeys.map(key => qwertyToJamo(key));
  return Hangul.assemble(jamos);
}
