import { SORT_KEYS } from './types'
import type { SortKey, SortOrder } from './types'

export const PAGE_SIZE = 25

export interface Filters {
    q: string
    status: string
    site: string
    page: number
    sort: SortKey
    order: SortOrder
}

export const DEFAULT_FILTERS: Filters = {
    q: '',
    status: '',
    site: '',
    page: 1,
    sort: 'CreatedDateTime1',
    order: 'desc',
}

// Read filters from URL query string. Invalid values fall back to defaults
export function parseFilters(search: string): Filters {
    const p = new URLSearchParams(search)
    const page = Number.parseInt(p.get('page') ?? '', 10)
    const sort = p.get('sort') as SortKey | null
    const order = p.get('order')
    return {
        q: (p.get('q') ?? '').trim(),
        status: p.get('status') ?? '',
        site: p.get('site') ?? '',
        page: Number.isFinite(page) && page >= 1 ? page : 1,
        sort: sort && SORT_KEYS.includes(sort) ? sort : DEFAULT_FILTERS.sort,
        order: order === 'asc' || order === 'desc' ? order : DEFAULT_FILTERS.order,
    }
}

// Write filters to browser URL
export function toUrlParams(f: Filters): URLSearchParams {
    const p = new URLSearchParams()
    if (f.q) p.set('q', f.q)
    if (f.status) p.set('status', f.status)
    if (f.site) p.set('site', f.site)
    if (f.page > 1) p.set('page', String(f.page))
    if (f.sort !== DEFAULT_FILTERS.sort || f.order !== DEFAULT_FILTERS.order) {
        p.set('sort', f.sort)
        p.set('order', f.order)
    }
    return p
}

// Build query string for API request
export function toApiParams(f: Filters): URLSearchParams {
    const p = new URLSearchParams({
        page: String(f.page),
        pageSize: String(PAGE_SIZE),
        sort: f.sort,
        order: f.order,
    })
    if (f.q) p.set('q', f.q)
    if (f.status) p.set('status', f.status)
    if (f.site) p.set('site', f.site)
    return p
}

export function hasActiveFilters(f: Filters): boolean {
    return Boolean(
        f.q ||
        f.status ||
        f.site ||
        f.sort !== DEFAULT_FILTERS.sort ||
        f.order !== DEFAULT_FILTERS.order
    )
}