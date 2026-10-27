import { defineConfig } from 'vitest/config'

// Unit tests cover plain TypeScript logic only; screens are checked on a device or emulator.
export default defineConfig({
  test: { include: ['src/**/*.test.ts'], environment: 'node' },
})
