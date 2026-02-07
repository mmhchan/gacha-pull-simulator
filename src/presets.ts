import type { GachaSystem } from './types';

export const GAME_PRESETS: GachaSystem[] = [
  {
    name: "Arknights: Endfield",
    baseRate: 0.008,
    softPityStart: 65,
    softPityIncrement: 0.05,
    hardPity: 80,
    featuredGuarantee: 120,
    hasFiftyFifty: true
  },
  {
    name: "Aggressive Slope (90 Cap)",
    baseRate: 0.006,
    softPityStart: 74,
    softPityIncrement: 0.06,
    hardPity: 90,
    featuredGuarantee: 180,
    hasFiftyFifty: true
  },
  {
    name: "High Base / Extended Floor",
    baseRate: 0.02,
    softPityStart: 50,
    softPityIncrement: 0.02,
    hardPity: 99,
    featuredGuarantee: 300,
    hasFiftyFifty: true
  },
  {
    name: "Flat Rate / Direct Milestone",
    baseRate: 0.03,
    softPityStart: 195, // Effectively no ramp
    softPityIncrement: 0.7,   // Instant hit at hard pity
    hardPity: 200,
    featuredGuarantee: 200,
    hasFiftyFifty: false
  },
  {
    name: "Low-Probability / Max Variance",
    baseRate: 0.01,
    softPityStart: 380,
    softPityIncrement: 0.05,
    hardPity: 400,
    featuredGuarantee: 400,
    hasFiftyFifty: true
  }
];