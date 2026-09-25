/**
 * Represents the type of a Korean jamo character.
 */
export type JamoType = 'consonant' | 'vowel';

/**
 * Maps a physical QWERTY key to its corresponding Korean 2-Set (두벌식) jamo.
 */
export interface KoreanKeyMapping {
  qwertyKey: string;
  jamoBase: string;
  jamoShift?: string;
  type: JamoType;
}

export const korean2SetMap: Record<string, KoreanKeyMapping> = {
  'q': { qwertyKey: 'q', jamoBase: 'ㅂ', jamoShift: 'ㅃ', type: 'consonant' },
  'w': { qwertyKey: 'w', jamoBase: 'ㅈ', jamoShift: 'ㅉ', type: 'consonant' },
  'e': { qwertyKey: 'e', jamoBase: 'ㄷ', jamoShift: 'ㄸ', type: 'consonant' },
  'r': { qwertyKey: 'r', jamoBase: 'ㄱ', jamoShift: 'ㄲ', type: 'consonant' },
  't': { qwertyKey: 't', jamoBase: 'ㅅ', jamoShift: 'ㅆ', type: 'consonant' },
  'a': { qwertyKey: 'a', jamoBase: 'ㅁ', type: 'consonant' },
  's': { qwertyKey: 's', jamoBase: 'ㄴ', type: 'consonant' },
  'd': { qwertyKey: 'd', jamoBase: 'ㅇ', type: 'consonant' },
  'f': { qwertyKey: 'f', jamoBase: 'ㄹ', type: 'consonant' },
  'g': { qwertyKey: 'g', jamoBase: 'ㅎ', type: 'consonant' },
  'z': { qwertyKey: 'z', jamoBase: 'ㅋ', type: 'consonant' },
  'x': { qwertyKey: 'x', jamoBase: 'ㅌ', type: 'consonant' },
  'c': { qwertyKey: 'c', jamoBase: 'ㅊ', type: 'consonant' },
  'v': { qwertyKey: 'v', jamoBase: 'ㅍ', type: 'consonant' },
  
  'y': { qwertyKey: 'y', jamoBase: 'ㅛ', type: 'vowel' },
  'u': { qwertyKey: 'u', jamoBase: 'ㅕ', type: 'vowel' },
  'i': { qwertyKey: 'i', jamoBase: 'ㅑ', type: 'vowel' },
  'o': { qwertyKey: 'o', jamoBase: 'ㅐ', jamoShift: 'ㅒ', type: 'vowel' },
  'p': { qwertyKey: 'p', jamoBase: 'ㅔ', jamoShift: 'ㅖ', type: 'vowel' },
  'h': { qwertyKey: 'h', jamoBase: 'ㅗ', type: 'vowel' },
  'j': { qwertyKey: 'j', jamoBase: 'ㅓ', type: 'vowel' },
  'k': { qwertyKey: 'k', jamoBase: 'ㅏ', type: 'vowel' },
  'l': { qwertyKey: 'l', jamoBase: 'ㅣ', type: 'vowel' },
  'b': { qwertyKey: 'b', jamoBase: 'ㅠ', type: 'vowel' },
  'n': { qwertyKey: 'n', jamoBase: 'ㅜ', type: 'vowel' },
  'm': { qwertyKey: 'm', jamoBase: 'ㅡ', type: 'vowel' }
};

export function qwertyToJamo(key: string): string {
  if (key === ' ') return ' ';
  const lowerKey = key.toLowerCase();
  const map = korean2SetMap[lowerKey];
  if (!map) return key;
  return (key !== lowerKey && map.jamoShift) ? map.jamoShift : map.jamoBase;
}
