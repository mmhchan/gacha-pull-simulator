export interface GachaSystem {
  name: string;
  baseRate: number;         // e.g., 0.008 (0.8%)
  softPityStart: number;    // When the rate starts climbing
  softPityIncrement: number;// How much it climbs per pull
  hardPity: number;         // Pull count for a guaranteed 6-star (any)
  featuredGuarantee: number;// The "Endfield" 120-pull style guarantee
  hasFiftyFifty: boolean;   // Does it have a 50/50 mechanic?
}

export interface SimParams extends GachaSystem {
  simCount: number;
}

export interface SimResult {
  pulls: number;
  wonAtGuarantee: boolean;
}