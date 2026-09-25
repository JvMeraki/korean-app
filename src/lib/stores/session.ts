import { writable, derived } from 'svelte/store';
import type { Exercise } from '@domain/practice/exercise';

/**
 * Represents the state of the current practice session.
 */
export interface PracticeSession {
  currentExerciseIndex: number;
  currentKeyIndex: number;
  errors: number;
  validKeystrokes: number;
  startTime: number | null;
  endTime: number | null;
  exercises: Exercise[];
  isCompleted: boolean;
  missedKeys: Record<string, number>;
  isTransitioning: boolean;
  currentTypedKeys: string[];
}

/**
 * Creates and initializes the practice session state machine store.
 */
function createPracticeSession() {
  const { subscribe, set, update } = writable<PracticeSession>({
    currentExerciseIndex: 0,
    currentKeyIndex: 0,
    errors: 0,
    validKeystrokes: 0,
    startTime: null,
    endTime: null,
    exercises: [],
    isCompleted: false,
    missedKeys: {},
    isTransitioning: false,
    currentTypedKeys: []
  });

  const store = {
    subscribe,
    start: (exercises: Exercise[]) => {
      set({
        currentExerciseIndex: 0,
        currentKeyIndex: 0,
        errors: 0,
        validKeystrokes: 0,
        startTime: null,
        endTime: null,
        exercises,
        isCompleted: exercises.length === 0,
        missedKeys: {},
        isTransitioning: false,
        currentTypedKeys: []
      });
    },
    nextExercise: () => {
      update(session => {
        const nextExerciseIndex = session.currentExerciseIndex + 1;
        
        if (nextExerciseIndex >= session.exercises.length) {
          return { 
            ...session, 
            isCompleted: true, 
            currentKeyIndex: 0, 
            isTransitioning: false,
            currentTypedKeys: [],
            endTime: Date.now()
          };
        }
        
        return { 
          ...session, 
          currentExerciseIndex: nextExerciseIndex, 
          currentKeyIndex: 0,
          isTransitioning: false,
          currentTypedKeys: []
        };
      });
    },
    handleBackspace: () => {
      update(session => {
        if (session.isCompleted || session.isTransitioning || session.currentTypedKeys.length === 0) return session;

        const wasCorrect = session.currentTypedKeys.length === session.currentKeyIndex;
        const newTypedKeys = session.currentTypedKeys.slice(0, -1);
        
        return {
          ...session,
          currentTypedKeys: newTypedKeys,
          currentKeyIndex: wasCorrect ? Math.max(0, session.currentKeyIndex - 1) : session.currentKeyIndex,
          validKeystrokes: wasCorrect ? Math.max(0, session.validKeystrokes - 1) : session.validKeystrokes
        };
      });
    },
    handleInput: (key: string) => {
      update(session => {
        if (session.isCompleted || session.isTransitioning) return session;

        // Strict Mode: Block further input if there is already an error!
        if (session.currentTypedKeys.length > session.currentKeyIndex) {
          return session; // Must press Backspace to fix the error
        }

        const currentExercise = session.exercises[session.currentExerciseIndex];
        const expectedKey = currentExercise.expectedSequence[session.currentKeyIndex];

        let newStartTime = session.startTime;
        if (!newStartTime) newStartTime = Date.now();

        const newTypedKeys = [...session.currentTypedKeys, key];

        if (key === expectedKey) {
          const nextKeyIndex = session.currentKeyIndex + 1;
          const newValidKeystrokes = session.validKeystrokes + 1;
          
          if (nextKeyIndex >= currentExercise.expectedSequence.length) {
            // Trigger delay before moving to next word
            setTimeout(() => {
              store.nextExercise();
            }, 1000);

            return { 
              ...session,
              currentKeyIndex: nextKeyIndex,
              currentTypedKeys: newTypedKeys,
              validKeystrokes: newValidKeystrokes,
              startTime: newStartTime,
              isTransitioning: true
            };
          }
          
          return { 
            ...session, 
            currentKeyIndex: nextKeyIndex,
            currentTypedKeys: newTypedKeys,
            validKeystrokes: newValidKeystrokes,
            startTime: newStartTime
          };
        } else {
          const newMissedKeys = { ...session.missedKeys };
          newMissedKeys[expectedKey] = (newMissedKeys[expectedKey] || 0) + 1;

          return { 
            ...session, 
            currentTypedKeys: newTypedKeys,
            errors: session.errors + 1,
            startTime: newStartTime,
            missedKeys: newMissedKeys
          };
        }
      });
    }
  };
  return store;
}

export const session = createPracticeSession();

export const currentExercise = derived(session, $session => 
  $session.isCompleted ? null : $session.exercises[$session.currentExerciseIndex]
);

export const expectedNextKey = derived([session, currentExercise], ([$session, $current]) => 
  $current ? $current.expectedSequence[$session.currentKeyIndex] : null
);

export const accuracy = derived(session, $session => {
  const total = $session.validKeystrokes + $session.errors;
  if (total === 0) return 100;
  return Math.round(($session.validKeystrokes / total) * 100);
});

export const sessionStats = derived(session, $session => {
  if (!$session.startTime || !$session.endTime) return { cpm: 0, timeSeconds: 0 };
  
  const timeSeconds = ($session.endTime - $session.startTime) / 1000;
  const timeMinutes = timeSeconds / 60;
  
  const cpm = timeMinutes > 0 ? Math.round($session.validKeystrokes / timeMinutes) : 0;
  
  return {
    cpm,
    timeSeconds: Math.round(timeSeconds)
  };
});

import { browser } from '$app/environment';
export const showHints = writable(true);

if (browser) {
  const savedHints = localStorage.getItem('showHints');
  if (savedHints !== null) {
    showHints.set(savedHints === 'true');
  }
  showHints.subscribe(val => {
    localStorage.setItem('showHints', val.toString());
  });
}
