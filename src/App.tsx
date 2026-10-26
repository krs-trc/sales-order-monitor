import { useCallback } from 'react'
import { Dashboard } from './components/Dashboard'
import { FilterBar } from './components/FilterBar'
import { OrdersTable, TableSkeleton } from './components/OrdersTable'
import { Pagination } from './components/Pagination'
import { updateFilters, useFilters, useMeta, useOrders } from './hooks'
import { formatInt } from './format'
import { hasActiveFilters } from './query'
import type { SortKey, SortOrder } from './types'

export default function App() {
  const filters = useFilters()
  const { data, loading, error, retry } = useOrders(filters)
  const { meta, failed: metaFailed } = useMeta()

  // Stable callbacks: SearchBox's debounce effect depends on onSearch.
  const onSearch = useCallback((q: string) => updateFilters({ q }, true), [])
  const onStatus = useCallback((status: string) => updateFilters({ status }), [])
  const onSite = useCallback((site: string) => updateFilters({ site }), [])
  const onSortSelect = useCallback(
    (sort: SortKey, order: SortOrder) => updateFilters({ sort, order }),
    [],
  )
  const onClear = useCallback(
    () =>
      updateFilters({
        q: '',
        status: '',
        site: '',
        sort: 'CreatedDateTime1',
        order: 'desc',
      }),
    [],
  )
  const onPage = useCallback((page: number) => updateFilters({ page }), [])

  const rows = data?.data ?? []
  const noMatches = !!data && !error && data.total === 0
  const pageOutOfRange = !!data && !error && data.total > 0 && rows.length === 0

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sales Order Monitor</h1>
        <p className="muted">Track sales orders across branches.</p>
      </header>

      <main>
        <Dashboard summary={data?.summary} />

        <FilterBar
          filters={filters}
          metaFailed={metaFailed}
          onSearch={onSearch}
        />

        <section aria-label="Orders" aria-busy={loading}>
          <div className="result-toolbar">
            <p className="result-count" aria-live="polite">
              {data && !error
                ? `Showing ${formatInt(data.total)} of ${formatInt(data.summary.total_orders)} orders`
                : ' '}
            </p>
            <button
              type="button"
              className="btn"
              onClick={onClear}
              disabled={!hasActiveFilters(filters)}
            >
              Clear filters
            </button>
          </div>

          {error ? (
            <div className="state state-error" role="alert">
              <h2>Couldn’t load orders</h2>
              <p>{error}</p>
              <button type="button" className="btn btn-primary" onClick={retry}>
                Try again
              </button>
            </div>
          ) : !data ? (
            <TableSkeleton />
          ) : noMatches ? (
            <div className="state">
              <h2>No orders found</h2>
              <p>Nothing matches your search and filters.</p>
            </div>
          ) : pageOutOfRange ? (
            <div className="state">
              <h2>That page doesn’t exist</h2>
              <p>There are only {data.totalPages} pages of results.</p>
              <button type="button" className="btn btn-primary" onClick={() => onPage(1)}>
                Go to page 1
              </button>
            </div>
          ) : (
            <div className={loading ? 'table-wrap is-loading' : 'table-wrap'}>
              <OrdersTable
                orders={rows}
                sort={filters.sort}
                order={filters.order}
                status={filters.status}
                site={filters.site}
                statusFacets={meta?.facets.statuses ?? []}
                siteFacets={meta?.facets.sites ?? []}
                onSort={onSortSelect}
                onStatus={onStatus}
                onSite={onSite}
              />
            </div>
          )}

          {data && !error && rows.length > 0 && (
            <Pagination page={data.page} totalPages={data.totalPages} onPage={onPage} />
          )}
        </section>
      </main>
    </div>
  )
}