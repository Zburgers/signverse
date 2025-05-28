// Bridge between original SignVerse JS animations and TypeScript system
import { AnimationReference, RawBoneAnimation } from './animationHandler';
import * as alphabets from '@/animations/alphabets';
import * as words from '@/animations/words';

/**
 * Animate a string of text using ISL (Indian Sign Language)
 * Processes each word/character and applies the appropriate animation
 */
export function animateText(
  ref: AnimationReference,
  text: string,
  speed: number = 0.1,
  pauseDuration: number = 800
): void {
  // Clear any existing animations
  ref.animations = [];
  
  // Convert text to uppercase for matching with alphabets
  const upperText = text.toUpperCase();
  const textWords = upperText.split(' ');
  
  // Process each word
  for (const word of textWords) {
    // Check if the word exists in the words library
    if ((words as any)[word]) {
      // Use the word animation
      (words as any)[word](ref);
    } else {
      // Process each character in the word
      for (const char of word) {
        // Check if the character exists in the alphabets library
        if ((alphabets as any)[char]) {
          // Use the alphabet animation
          (alphabets as any)[char](ref);
        }
      }
    }
  }
  
  // Start the animation if not already running
  if (ref.pending === false) {
    ref.pending = true;
    ref.animate();
  }
}

/**
 * Get available words from the words library
 */
export function getAvailableWords(): string[] {
  return (words as any).wordList || [];
}

/**
 * Get available alphabets
 */
export function getAvailableAlphabets(): string[] {
  // Generate A-Z array
  return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
}

/**
 * Apply a specific alphabet animation
 */
export function animateAlphabet(
  ref: AnimationReference,
  alphabet: string
): void {
  const char = alphabet.toUpperCase();
  if ((alphabets as any)[char]) {
    ref.animations = [];
    (alphabets as any)[char](ref);
    
    if (ref.pending === false) {
      ref.pending = true;
      ref.animate();
    }
  }
}

/**
 * Apply a specific word animation
 */
export function animateWord(
  ref: AnimationReference,
  word: string
): void {
  const upperWord = word.toUpperCase();
  if ((words as any)[upperWord]) {
    ref.animations = [];
    (words as any)[upperWord](ref);
    
    if (ref.pending === false) {
      ref.pending = true;
      ref.animate();
    }
  }
}
