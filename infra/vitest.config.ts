import { defineConfig } from 'vitest/config'

// Synthesising stacks bundles the Lambda with esbuild, which takes a few seconds.
export default defineConfig({ test: { include: ['test/**/*.test.ts'], testTimeout: 60_000 } })
