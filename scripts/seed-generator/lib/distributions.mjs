/**
 * lib/distributions.mjs — Seedable statistical distributions for realistic data.
 *
 * RNG: deterministic mulberry32 (32-bit) — fast, fast-period, sufficient for seed.
 * Reproducibility: seed = sha256(`<tenant>_<stage>_<entity>`) prefix as int.
 *
 * Distributions:
 *   - gaussian(mu, sigma)         — clamped Bell curve (Box-Muller)
 *   - quintile(weights)           — pick index by weighted probability
 *   - poisson(lambda)             — Poisson sampling (Knuth method)
 *   - exponentialDecay(lambda)    — exponential decay (e.g. hire_date)
 *   - uniformInt(lo, hi)          — uniform integer
 */

/**
 * Seedable RNG. Returns next float in [0, 1).
 * @param {number} seed
 * @returns {() => number}
 */
export function mulberry32(seed) {
  let s = seed >>> 0;
  return function next() {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Derive 32-bit seed from string (FNV-1a). */
export function seedFromString(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Clamped Gaussian via Box-Muller. */
export function gaussian(rng, mu, sigma, lo = -Infinity, hi = Infinity) {
  let u1 = rng();
  while (u1 === 0) u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const v = mu + z * sigma;
  return Math.max(lo, Math.min(hi, v));
}

/** Pick index 0..weights.length-1 with probabilities ∝ weights. */
export function quintile(rng, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

/** Poisson sampling (Knuth method, ok per lambda < 30). */
export function poisson(rng, lambda) {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k += 1;
    p *= rng();
  } while (p > L);
  return k - 1;
}

/** Exponential decay sampling (e.g. years since hire). */
export function exponentialDecay(rng, lambda) {
  return -Math.log(1 - rng()) / lambda;
}

/** Uniform integer [lo, hi] inclusive. */
export function uniformInt(rng, lo, hi) {
  return Math.floor(lo + rng() * (hi - lo + 1));
}

/** Pick one element from array uniformly. */
export function pickOne(rng, arr) {
  if (arr.length === 0) throw new Error('pickOne: empty array');
  return arr[Math.floor(rng() * arr.length)];
}
