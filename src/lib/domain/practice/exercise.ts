import { decomposeToQwerty } from '@domain/hangul/unicode';
import { dictionary } from './dictionary';

/**
 * Defines a typing exercise for the practice session.
 */
export interface Exercise {
  id: string;
  target: string;
  expectedSequence: string[];
}

/**
 * Generates a practice session dynamically from the dictionary.
 */
export function generateSession(difficulty: keyof typeof dictionary, count: number = 5): Exercise[] {
  const words = dictionary[difficulty];
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return selected.map((word, index) => ({
    id: `${difficulty}-${Date.now()}-${index}`,
    target: word,
    expectedSequence: decomposeToQwerty(word)
  }));
}
