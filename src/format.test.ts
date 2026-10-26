import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, formatInt } from './format'

describe('formatCurrency', () => {
  it('formats as Malaysian ringgit with two decimals', () => {
    const out = formatCurrency(162.35)
    expect(out).toMatch(/RM/)
    expect(out).toMatch(/162\.35/)
  })

  it('uses thousands separators for large totals', () => {
    expect(formatCurrency(998244.3)).toMatch(/998,244\.30/)
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toMatch(/0\.00/)
  })
})

describe('formatInt', () => {
  it('adds thousands separators', () => {
    expect(formatInt(1200)).toBe('1,200')
  })
})

describe('formatDate', () => {
  it('shows the Malaysian calendar date for a UTC timestamp', () => {
    // 2026-09-30T20:00Z is already 1 Oct in Kuala Lumpur (UTC+8)
    expect(formatDate('2026-09-30T20:00:00.000Z')).toMatch(/1\s+Oct(ober)?\s+2026/)
  })

  it('does not throw on an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('-')
  })
})