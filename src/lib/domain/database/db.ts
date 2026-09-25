import Dexie, { type Table } from 'dexie';

/**
 * Represents a completed practice session result.
 */
export interface PracticeResult {
  id?: number;
  date: Date;
  accuracy: number;
  cpm: number;
  timeSeconds: number;
  errors: number;
  validKeystrokes: number;
  missedKeys: Record<string, number>;
}

/**
 * Dexie database wrapper for Hangeul Type Lab.
 */
export class HangeulTypeLabDB extends Dexie {
  sessions!: Table<PracticeResult, number>;

  constructor() {
    super('HangeulTypeLabDB');
    
    // Define database schema
    this.version(1).stores({
      sessions: '++id, date, accuracy, cpm'
    });
  }
}

export const db = new HangeulTypeLabDB();
