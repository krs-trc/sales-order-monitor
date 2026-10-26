import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { errorMessage, fetchMeta, fetchOrders } from './api'
import { parseFilters, toApiParams, toUrlParams } from './query'
import type { Filters } from './query'
import type { Meta, OrdersResponse } from './types'

const URL_EVENT = 'filters-changed'

function subscribe(cb: () => void) {
    window.addEventListener('popstate', cb) // back or forward
    window.addEventListener(URL_EVENT, cb)  // own pushState or replaceState

    return () => {
        window.removeEventListener('popstate', cb)
        window.removeEventListener(URL_EVENT, cb)
    }
}

const getSearch = () => window.location.search

export function updateFilters(patch: Partial<Filters>, replace = false): void {
  const current = parseFilters(window.location.search)
  const next: Filters = { ...current, ...patch }
  if (!('page' in patch)) next.page = 1
  next.q = next.q.trim()

  const qs = toUrlParams(next).toString()
  const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`
  if (url === `${window.location.pathname}${window.location.search}`) return

  if (replace) window.history.replaceState(null, '', url)
  else window.history.pushState(null, '', url)
  window.dispatchEvent(new Event(URL_EVENT))
}

export function useFilters(): Filters {
  const search = useSyncExternalStore(subscribe, getSearch, () => '')
  return useMemo(() => parseFilters(search), [search])
}

interface OrdersResult {
  key: string
  data?: OrdersResponse // last successful response (kept while the next one loads)
  error?: string
}

export function useOrders(filters: Filters) {
  const query = toApiParams(filters).toString()
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<OrdersResult | null>(null)
  const requestKey = `${query}#${attempt}`

  useEffect(() => {
    const ctrl = new AbortController()
    const key = `${query}#${attempt}`
    fetchOrders(query, ctrl.signal).then(
      (data) => setResult({ key, data }),
      (err: unknown) => {
        if (ctrl.signal.aborted) return // superseded by a newer request
        setResult((prev) => ({ key, data: prev?.data, error: errorMessage(err) }))
      },
    )
    return () => ctrl.abort()
  }, [query, attempt])

  const settled = result?.key === requestKey
  return {
    data: result?.data,
    loading: !settled,
    error: settled ? result.error : undefined,
    retry: useCallback(() => setAttempt((a) => a + 1), []),
  }
}

/* Facets (status / site lists with counts) come from /meta, never hard-coded. */
export function useMeta() {
  const [meta, setMeta] = useState<Meta | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    fetchMeta(ctrl.signal).then(setMeta, () => {
      if (!ctrl.signal.aborted) setFailed(true)
    })
    return () => ctrl.abort()
  }, [])

  return { meta, failed }
}