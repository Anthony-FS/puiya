export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['mobile', 'web', 'api', 'shared', 'ui', 'infra', 'docs', 'deps', 'ci', 'repo'],
    ],
  },
}
