// Type definitions for animations

export interface BoneAnimation {
  [key: string]: number[];
}

export interface AnimationData {
  key: string;
  label: string;
  animation: BoneAnimation;
}

// Export all alphabets
export const A: BoneAnimation;
export const B: BoneAnimation;
export const C: BoneAnimation;
export const D: BoneAnimation;
export const E: BoneAnimation;
export const F: BoneAnimation;
export const G: BoneAnimation;
export const H: BoneAnimation;
export const I: BoneAnimation;
export const J: BoneAnimation;
export const K: BoneAnimation;
export const L: BoneAnimation;
export const M: BoneAnimation;
export const N: BoneAnimation;
export const O: BoneAnimation;
export const P: BoneAnimation;
export const Q: BoneAnimation;
export const R: BoneAnimation;
export const S: BoneAnimation;
export const T: BoneAnimation;
export const U: BoneAnimation;
export const V: BoneAnimation;
export const W: BoneAnimation;
export const X: BoneAnimation;
export const Y: BoneAnimation;
export const Z: BoneAnimation;

// Export words
export const TIME: BoneAnimation;
export const HOME: BoneAnimation;
export const PERSON: BoneAnimation;
export const YOU: BoneAnimation;
export const wordList: string[];
