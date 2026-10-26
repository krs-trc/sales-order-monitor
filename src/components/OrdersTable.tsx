import { formatCurrency, formatDate } from '../format'
import type { Order, SortKey, SortOrder } from '../types'

interface Props {
  orders: Order[]
  sort: SortKey
  order: SortOrder
  onSort: (sort: SortKey) => void
}

/* Status is shown as text *and* colour, so it never relies on colour alone. */
function statusTone(status: string): string {
  switch (status) {
    case 'Open order':
      return 'open'
    case 'Invoiced':
    case 'Delivered':
      return 'done'
    case 'Cancelled':
      return 'cancelled'
    default:
      return 'neutral' // unknown future status: still displayed, just unstyled
  }
}

function SortHeader({
  label,
  field,
  sort,
  order,
  onSort,
  align,
}: {
  label: string
  field: SortKey
  sort: SortKey
  order: SortOrder
  onSort: (f: SortKey) => void
  align?: 'right'
}) {
  const active = sort === field
  return (
    <th
      scope="col"
      className={align === 'right' ? 'num' : undefined}
      aria-sort={active ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button type="button" className="th-btn" onClick={() => onSort(field)}>
        {label}
        <span aria-hidden="true" className="sort-arrow">
          {active ? (order === 'asc' ? '▲' : '▼') : ''}
        </span>
      </button>
    </th>
  )
}

export function OrdersTable({ orders, sort, order, onSort }: Props) {
  const h = { sort, order, onSort }
  return (
    <table className="orders">
      <thead>
        <tr>
          <SortHeader label="Order no." field="SalesId" {...h} />
          <th scope="col">Customer</th>
          <SortHeader label="Branch" field="InventSiteId" {...h} />
          <SortHeader label="Order date" field="CreatedDateTime1" {...h} />
          <SortHeader label="Status" field="SalesStatus" {...h} />
          <SortHeader label="Amount" field="HAR_TotalSOAmount" align="right" {...h} />
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.SalesId}>
            <td data-label="Order no." className="mono">
              {o.SalesId}
            </td>
            <td data-label="Customer">
              <span className="cust-name">{o.SalesName}</span>
              <span className="cust-acc">{o.CustAccount}</span>
            </td>
            <td data-label="Branch">{o.InventSiteId}</td>
            <td data-label="Order date">{formatDate(o.CreatedDateTime1)}</td>
            <td data-label="Status">
              <span className={`badge tone-${statusTone(o.SalesStatus)}`}>{o.SalesStatus}</span>
            </td>
            <td data-label="Amount" className="num">
              {formatCurrency(o.HAR_TotalSOAmount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* Placeholder rows shown on the very first load. */
export function TableSkeleton() {
  return (
    <div className="skeleton-table" aria-label="Loading orders" role="status">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="skeleton skeleton-row" />
      ))}
    </div>
  )
}