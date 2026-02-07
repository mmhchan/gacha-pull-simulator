import type { SimParams, SimResult } from './types';

export const runMonteCarlo = (params: SimParams): SimResult[] => {
  const results: SimResult[] = [];

  for (let i = 0; i < params.simCount; i++) {
    let totalPulls = 0;
    let pityCounter = 0;
    let featuredCounter = 0;
    let wonFeatured = false;

    while (!wonFeatured) {
      totalPulls++;
      pityCounter++;
      featuredCounter++;

      // 1. Calculate Soft Pity Rate
      let currentRate = params.baseRate;
      if (pityCounter > params.softPityStart) {
        currentRate += (pityCounter - params.softPityStart) * params.softPityIncrement;
      }

      const roll = Math.random();

      // 2. Check for Guarantees
      const hitHardPity = pityCounter >= params.hardPity;
      const hitFeaturedGuarantee = featuredCounter >= params.featuredGuarantee;

      if (roll < currentRate || hitHardPity || hitFeaturedGuarantee) {
        let isFeatured = false;

        // If we hit the 120 mark, it's 100% featured
        if (hitFeaturedGuarantee) {
          isFeatured = true;
        } else if (params.hasFiftyFifty) {
          // Otherwise, standard 50/50 check
          isFeatured = Math.random() < 0.5;
        } else {
          isFeatured = true;
        }

        if (isFeatured) {
          wonFeatured = true;
          results.push({ pulls: totalPulls, wonAtGuarantee: hitFeaturedGuarantee });
        } else {
          // Lost 50/50: Reset standard pity, but featured guarantee keeps ticking to 120
          pityCounter = 0;
        }
      }
    }
  }
  return results;
};

export const formatDataForChart = (results: number[]) => {
  const distribution: Record<number, number> = {};
  results.forEach(num => {
    distribution[num] = (distribution[num] || 0) + 1;
  });

  return Object.keys(distribution)
    .map(key => ({
      pullCount: Number(key),
      count: distribution[Number(key)]
    }))
    .sort((a, b) => a.pullCount - b.pullCount);
};