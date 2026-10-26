interface Props {
  page: number
  totalPages: number
  onPage: (page: number) => void
}

export function Pagination({ page, totalPages, onPage }: Props) {
  if (totalPages <= 1) return null
  return (
    <nav className="pager" aria-label="Pagination">
      <button type="button" className="btn" onClick={() => onPage(1)} disabled={page <= 1}>
        « First
      </button>
      <button type="button" className="btn" onClick={() => onPage(page - 1)} disabled={page <= 1}>
        ‹ Prev
      </button>
      <span className="pager-info">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="btn"
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
      >
        Next ›
      </button>
      <button
        type="button"
        className="btn"
        onClick={() => onPage(totalPages)}
        disabled={page >= totalPages}
      >
        Last »
      </button>
    </nav>
  )
}