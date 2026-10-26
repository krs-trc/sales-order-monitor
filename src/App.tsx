import { useState, useEffect } from 'react'
import { fetchOrders, errorMessage } from './api'
import { formatDate, formatCurrency } from './format'
import type { OrdersResponse } from './types'

export default function App() {
  const [data, setData] = useState<OrdersResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders('page=1&pageSize=25').then(setData, (e: unknown) => setError(errorMessage(e)))
  }, [])

  if (error) return <p role="alert">Error: {error}</p>
  if (!data) return <p>Loading...</p>

  return (
    <div className="App">
      <h1>Sales Order Monitor</h1>

      <p>Loaded {data.data.length} of {data.total} orders</p>

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
    </div>
  )
}