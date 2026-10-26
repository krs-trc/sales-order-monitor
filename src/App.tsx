import { updateFilters, useFilters, useOrders } from './hooks'
import { formatCurrency, formatDate, formatInt } from './format'

export default function App() {
  const filters = useFilters()
  const { data, loading, error, retry } = useOrders(filters)

  return (
    <div className="app">
      <h1>Sales Order Monitor</h1>

      {loading && <p>Loading…</p>}

      {error && (
        <p role="alert">
          {error} <button onClick={retry}>Try again</button>
        </p>
      )}

      {data && !error && (
        <>
          <p>Showing {formatInt(data.total)} orders</p>
          <table className="orders">
            <thead>
              <tr>
                <th>Order no.</th>
                <th>Customer</th>
                <th>Branch</th>
                <th>Order date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((o) => (
                <tr key={o.SalesId}>
                  <td>{o.SalesId}</td>
                  <td>{o.SalesName}</td>
                  <td>{o.InventSiteId}</td>
                  <td>{formatDate(o.CreatedDateTime1)}</td>
                  <td>{o.SalesStatus}</td>
                  <td>{formatCurrency(o.HAR_TotalSOAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button disabled={data.page <= 1} onClick={() => updateFilters({ page: data.page - 1 })}>
            Prev
          </button>
          <span>
            {' '}
            Page {data.page} of {data.totalPages}{' '}
          </span>
          <button
            disabled={data.page >= data.totalPages}
            onClick={() => updateFilters({ page: data.page + 1 })}
          >
            Next
          </button>
        </>
      )}
    </div>
  )
}