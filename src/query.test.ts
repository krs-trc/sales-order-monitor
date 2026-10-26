import { describe, expect, it } from 'vitest'
import { DEFAULT_FILTERS, hasActiveFilters, parseFilters, toApiParams, toUrlParams } from './query'

describe('parseFilters', () => {
  it('returns defaults for an empty query string', () => {
    expect(parseFilters('')).toEqual(DEFAULT_FILTERS)
  })

  it('reads every parameter', () => {
    const f = parseFilters('?q=Siti&status=Open+order&site=B20&page=3&sort=HAR_TotalSOAmount&order=asc')
    expect(f).toEqual({
      q: 'Siti',
      status: 'Open order',
      site: 'B20',
      page: 3,
      sort: 'HAR_TotalSOAmount',
      order: 'asc',
    })
  })

  it('falls back to defaults for invalid page, sort and order', () => {
    const f = parseFilters('?page=-4&sort=Password&order=sideways')
    expect(f.page).toBe(1)
    expect(f.sort).toBe(DEFAULT_FILTERS.sort)
    expect(f.order).toBe(DEFAULT_FILTERS.order)
  })

  it('treats a non-numeric page as page 1', () => {
    expect(parseFilters('?page=abc').page).toBe(1)
  })

  it('trims the search text', () => {
    expect(parseFilters('?q=%20%20Siti%20').q).toBe('Siti')
  })
})

describe('toUrlParams', () => {
  it('omits defaults so the URL stays clean', () => {
    expect(toUrlParams(DEFAULT_FILTERS).toString()).toBe('')
  })

  it('round-trips through parseFilters', () => {
    const f = { ...DEFAULT_FILTERS, q: 'Siti', status: 'Open order', site: 'B20', page: 2 }
    expect(parseFilters(toUrlParams(f).toString())).toEqual(f)
  })
})

describe('toApiParams', () => {
  it('always sends page, pageSize (<= 100), sort and order', () => {
    const p = toApiParams(DEFAULT_FILTERS)
    expect(p.get('page')).toBe('1')
    expect(Number(p.get('pageSize'))).toBeLessThanOrEqual(100)
    expect(p.get('sort')).toBe('CreatedDateTime1')
    expect(p.get('order')).toBe('desc')
  })

  it('only includes filters that are set, and encodes spaces', () => {
    const p = toApiParams({ ...DEFAULT_FILTERS, status: 'Open order' })
    expect(p.get('status')).toBe('Open order')
    expect(p.toString()).toContain('status=Open+order')
    expect(p.has('site')).toBe(false)
    expect(p.has('q')).toBe(false)
  })
})

describe('hasActiveFilters', () => {
  it('ignores page and sort', () => {
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, page: 5, order: 'asc' })).toBe(false)
  })
  it('is true when search, status or site is set', () => {
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, q: 'x' })).toBe(true)
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, status: 'Cancelled' })).toBe(true)
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, site: 'A10' })).toBe(true)
  })
})