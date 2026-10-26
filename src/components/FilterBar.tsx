import { useEffect, useState } from 'react'
import type { Filters } from '../query'

interface Props {
  filters: Filters
  metaFailed: boolean
  onSearch: (q: string) => void
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
  metaFailed,
  onSearch,
}: Props) {
  return (
    <section className="filters" aria-label="Search and filters">
      <SearchBox value={filters.q} onCommit={onSearch} />

      {metaFailed && (
        <p className="muted filters-note" role="status">
          Couldn’t load the status / branch lists, so those header filters are unavailable. Search still works.
        </p>
      )}
    </section>
  )
}