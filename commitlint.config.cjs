/**
 * RTGB commitlint config.
 * Accepts conventional commits + custom RTGB types (deps, security, adr, story, tokens, obs, ...).
 * Note: the [RTGB][PHx-Ty] signature path is handled in .husky/commit-msg before invoking commitlint.
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        // Conventional
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        // RTGB-specific (also fall-through-allowed via .husky/commit-msg)
        'deps',
        'config',
        'security',
        'adr',
        'schema',
        'ui',
        'story',
        'tokens',
        'obs',
        'migration',
        'a11y',
      ],
    ],
    'subject-case': [0],
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};
