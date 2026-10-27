import { afterEach, describe, expect, it, vi } from 'vitest'
import { handler } from './health'

describe('health handler', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('reports ok with the stage', async () => {
    vi.stubEnv('STAGE', 'staging')
    const res = await handler()
    expect(typeof res).toBe('object')
    if (typeof res !== 'object') return
    expect(res.statusCode).toBe(200)
    const body = JSON.parse(String(res.body))
    expect(body).toMatchObject({ status: 'ok', service: 'puiya-api', stage: 'staging' })
    expect(Number.isNaN(Date.parse(body.time))).toBe(false)
  })

  it('never exposes table names or other configuration', async () => {
    vi.stubEnv('MAIN_TABLE', 'puiya-staging-main')
    const res = await handler()
    if (typeof res !== 'object') return
    expect(String(res.body)).not.toContain('puiya-staging-main')
  })
})
