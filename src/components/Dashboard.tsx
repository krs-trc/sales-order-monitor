import { formatCurrency, formatInt } from '../format'
import type { Summary } from '../types'

interface Props {
  summary?: Summary // undefined until the first response arrives
}

export function Dashboard({ summary }: Props) {
  const s = summary
  const cards = [
    { label: 'Total orders', value: s && formatInt(s.total_orders), tone: 'neutral' },
    { label: 'Open / pending', value: s && formatInt(s.open_orders), tone: 'open' },
    {
      label: 'Completed',
      value: s && formatInt(s.invoiced_orders + s.delivered_orders),
      note: s && `${formatInt(s.invoiced_orders)} invoiced · ${formatInt(s.delivered_orders)} delivered`,
      tone: 'done',
    },
    { label: 'Cancelled', value: s && formatInt(s.cancelled_orders), tone: 'cancelled' },
    { label: 'Total order value', value: s && formatCurrency(s.total_order_value), tone: 'neutral', wide: true },
  ]

  return (
    <section aria-labelledby="dash-title">
      <div className="section-head">
        <h2 id="dash-title">Overview</h2>
        <p className="muted">All orders — these totals don’t change with the filters below.</p>
      </div>
      <div className="cards">
        {cards.map((c) => (
          <article key={c.label} className={`card tone-${c.tone}${c.wide ? ' card-wide' : ''}`}>
            <h3>{c.label}</h3>
            {c.value === undefined ? (
              <div className="skeleton skeleton-value" aria-label="Loading" />
            ) : (
              <p className="card-value">{c.value}</p>
            )}
            {c.note && <p className="card-note">{c.note}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}