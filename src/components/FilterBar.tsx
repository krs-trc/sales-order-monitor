import { useEffect, useState } from 'react'
import { SORT_KEYS } from '../types'
import type { Meta, SortKey, SortOrder } from '../types'
import type { Filters } from '../query'
import { hasActiveFilters } from '../query'

interface Props {
  filters: Filters
  meta: Meta | null
  metaFailed: boolean
  onSearch: (q: string) => void
  onStatus: (status: string) => void
  onSite: (site: string) => void
  onSort: (sort: SortKey, order: SortOrder) => void
  onClear: () => void
}

const SORT_LABELS: Record<SortKey, [asc: string, desc: string]> = {
  CreatedDateTime1: ['Oldest first', 'Newest first'],
  HAR_TotalSOAmount: ['Amount: low to high', 'Amount: high to low'],
  SalesId: ['Order no. A → Z', 'Order no. Z → A'],
  SalesStatus: ['Status A → Z', 'Status Z → A'],
  InventSiteId: ['Branch A → Z', 'Branch Z → A'],
}

/* Search box with a 300 ms debounce: the URL / API are only updated once typing pauses. */
function SearchBox({ value, onCommit }: { value: string; onCommit: (q: string) => void }) {
  const [text, setText] = useState(value)
  const [seen, setSeen] = useState(value)

  // Adopt changes that came from outside (Clear filters, back button) — but never
  // overwrite what the user is typing (e.g. a trailing space that the URL trims).
  if (value !== seen) {
    setSeen(value)
    if (value !== text.trim()) setText(value)
  }

  useEffect(() => {
    if (text.trim() === value) return
    const t = setTimeout(() => onCommit(text), 300)
    return () => clearTimeout(t)
  }, [text, value, onCommit])

  return (
    <label className="field field-search">
      <span>Search</span>
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Order no., customer, salesperson"
        autoComplete="off"
      />
    </label>
  )
}

export function FilterBar({
  filters,
  meta,
  metaFailed,
  onSearch,
  onStatus,
  onSite,
  onSort,
  onClear,
}: Props) {
  const statuses = meta?.facets.statuses ?? []
  const sites = meta?.facets.sites ?? []

  return (
    <section className="filters" aria-label="Search and filters">
      <SearchBox value={filters.q} onCommit={onSearch} />

      <label className="field">
        <span>Status</span>
        <select value={filters.status} onChange={(e) => onStatus(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.value} ({s.count})
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Branch / site</span>
        <select value={filters.site} onChange={(e) => onSite(e.target.value)}>
          <option value="">All branches</option>
          {sites.map((s) => (
            <option key={s.value} value={s.value}>
              {s.value} ({s.count})
            </option>
          ))}
        </select>
      </label>

      {/* Table headers sort on desktop; on mobile the table becomes cards, so offer a select. */}
      <label className="field field-sort">
        <span>Sort by</span>
        <select
          value={`${filters.sort}:${filters.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split(':') as [SortKey, SortOrder]
            onSort(sort, order)
          }}
        >
          {SORT_KEYS.flatMap((k) =>
            (['desc', 'asc'] as const).map((o) => (
              <option key={`${k}:${o}`} value={`${k}:${o}`}>
                {SORT_LABELS[k][o === 'asc' ? 0 : 1]}
              </option>
            )),
          )}
        </select>
      </label>

      <button
        type="button"
        className="btn"
        onClick={onClear}
        disabled={!hasActiveFilters(filters)}
      >
        Clear filters
      </button>

      {metaFailed && (
        <p className="muted filters-note" role="status">
          Couldn’t load the status / branch lists, so those filters are unavailable. Search still works.
        </p>
      )}
    </section>
  )
}