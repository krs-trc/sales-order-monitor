import { formatCurrency, formatDate } from '../format'
import type { Facet, Order, SortKey, SortOrder } from '../types'

interface Props {
  orders: Order[]
  sort: SortKey
  order: SortOrder
  status: string
  site: string
  statusFacets: Facet[]
  siteFacets: Facet[]
  onSort: (sort: SortKey, order: SortOrder) => void
  onStatus: (status: string) => void
  onSite: (site: string) => void
}

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
      return 'neutral'
  }
}

function FacetHeader({
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string
  allLabel: string
  value: string
  options: Facet[]
  onChange: (value: string) => void
}) {
  const sortedOptions = [...options].sort((a, b) => a.value.localeCompare(b.value))

  return (
    <th scope="col">
      <label className="header-control">
        <span>{label}</span>
        <select
          className="header-select"
          aria-label={`Filter by ${label.toLowerCase()}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{allLabel}</option>
          {value && !sortedOptions.some((option) => option.value === value) && (
            <option value={value}>{value}</option>
          )}
          {sortedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value} ({option.count})
            </option>
          ))}
        </select>
      </label>
    </th>
  )
}

function SortHeader({
  label,
  field,
  sort,
  order,
  options,
  onSort,
}: {
  label: string
  field: SortKey
  sort: SortKey
  order: SortOrder
  options: { value: SortOrder; label: string }[]
  onSort: (sort: SortKey, order: SortOrder) => void
}) {
  const selectedOrder = sort === field ? order : ''

  return (
    <th scope="col" aria-sort={sort === field ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <label className="header-control">
        <span>{label}</span>
        <select
          className="header-select"
          aria-label={`Sort ${label.toLowerCase()}`}
          value={selectedOrder}
          onChange={(event) => onSort(field, event.target.value as SortOrder)}
        >
          <option value="" disabled>Sort</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </th>
  )
}

export function OrdersTable({
  orders,
  sort,
  order,
  status,
  site,
  statusFacets,
  siteFacets,
  onSort,
  onStatus,
  onSite,
}: Props) {
  return (
    <table className="orders">
      <thead>
        <tr>
          <th scope="col">Order no.</th>
          <th scope="col">Customer</th>
          <FacetHeader
            label="Branch"
            allLabel="All branches"
            value={site}
            options={siteFacets}
            onChange={onSite}
          />
          <SortHeader
            label="Order date"
            field="CreatedDateTime1"
            sort={sort}
            order={order}
            options={[
              { value: 'desc', label: 'Newest first' },
              { value: 'asc', label: 'Oldest first' },
            ]}
            onSort={onSort}
          />
          <FacetHeader
            label="Status"
            allLabel="All statuses"
            value={status}
            options={statusFacets}
            onChange={onStatus}
          />
          <SortHeader
            label="Amount"
            field="HAR_TotalSOAmount"
            sort={sort}
            order={order}
            options={[
              { value: 'desc', label: 'High to low' },
              { value: 'asc', label: 'Low to high' },
            ]}
            onSort={onSort}
          />
        </tr>
      </thead>
      <tbody>
        {orders.map((orderRow) => (
          <tr key={orderRow.SalesId}>
            <td data-label="Order no." className="mono">
              {orderRow.SalesId}
            </td>
            <td data-label="Customer">
              <span className="cust-name">{orderRow.SalesName}</span>
              <span className="cust-acc">{orderRow.CustAccount}</span>
            </td>
            <td data-label="Branch">{orderRow.InventSiteId}</td>
            <td data-label="Order date">{formatDate(orderRow.CreatedDateTime1)}</td>
            <td data-label="Status">
              <span className={`badge tone-${statusTone(orderRow.SalesStatus)}`}>
                {orderRow.SalesStatus}
              </span>
            </td>
            <td data-label="Amount" className="num">
              {formatCurrency(orderRow.HAR_TotalSOAmount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function TableSkeleton() {
  return (
    <div className="skeleton-table" aria-label="Loading orders" role="status">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="skeleton skeleton-row" />
      ))}
    </div>
  )
}
