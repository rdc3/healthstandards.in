const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  // Handle ES modules more comprehensively
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(remark|remark-parse|remark-html|remark-gfm|unified|bail|is-plain-obj|trough|vfile|unist-util-stringify-position|mdast-util-to-hast|mdast-util-to-string|unist-util-position|unist-util-visit|micromark|decode-named-character-reference|character-entities|mdast-util-gfm|mdast-util-from-markdown|mdast-util-to-markdown|mdast-util-definitions|mdast-util-find-and-replace|mdast-util-gfm-autolink-literal|mdast-util-gfm-footnote|mdast-util-gfm-strikethrough|mdast-util-gfm-table|mdast-util-gfm-task-list-item|mdast-util-phrasing|mdast-util-to-nlcst|unist-util-generated|unist-util-is|unist-util-remove-position|unist-util-visit-parents|zwitch)/)'
  ],
  // Add module name mapping for problematic modules
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)