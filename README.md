# Sales Order Monitor

A responsive web app for viewing sales orders across branches. It includes an overview dashboard and a searchable, filterable, sortable, paginated order list. Data is requested from the configured read-only mock API.

**Live demo:** [Link to App](https://sales-order-monitor-five.vercel.app/)

**Stack:** React 19, TypeScript, Vite, plain CSS, and Vitest.

## Run locally

Requires Node.js 22.12+ (or 20.19+) and npm.

```bash
npm install
```

Copy `.env.example` to `.env.local`, then edit `.env.local` and set the API URL and key:

```env
VITE_API_BASE=https://hiring.harrisons.my/api/mock/sales-orders
VITE_API_KEY=your-api-key
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Vite prints the local URL when the server starts (usually `http://localhost:5173`).

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Type-checks the app and creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |
| `npm test` | Runs the Vitest unit tests |

The `VITE_` environment variables are included in the client bundle at build time. Changing them for a deployment requires rebuilding the app.

## Features

- **Overview cards:** total orders, open/pending orders, completed orders (invoiced plus delivered), cancelled orders, and total order value.
- **Order list:** order number, customer and account, branch/site, order date, status, and amount.
- **Search:** debounced by 300 ms; the API searches order number, customer, account, customer reference, and salesperson.
- **Branch and status filters:** select options in the respective table headers; option values and counts come from the API's `/meta` endpoint.
- **Sorting:** select newest/oldest for order date and high/low for amount from the table headers. The API also supports sorting by order number, status, and branch.
- **Pagination:** server-side, 25 orders per page.
- **Shareable URLs:** search, branch/status filters, sort, and page are represented in the query string. Refresh and browser back/forward retain the current view.
- **Clear filters:** clears search and branch/status filters and resets sorting to newest order date first.
- **Loading and error states:** skeleton placeholders, no-results messaging, an out-of-range page message, and a retry action when orders fail to load.
- **Responsive layout:** table on larger screens; filter controls and order cards on compact screens. Light or dark colors follow the system preference.

## Project structure

```text
src/
  api.ts                  API fetch wrapper and error handling
  types.ts                TypeScript types for API responses and sort fields
  query.ts                URL and API query parsing/building; filter defaults
  hooks.ts                URL-backed filters and API data hooks
  format.ts               Currency, date, and number formatting
  App.tsx                 Connects the dashboard, filters, table, and pagination
  components/
    Dashboard.tsx         Overview cards
    FilterBar.tsx         Debounced search and API warning
    OrdersTable.tsx       Order list, header filters, and sort controls
    Pagination.tsx        Page navigation
```

## Tests

Run the unit tests with:

```bash
npm test
```

The tests cover URL and API query construction, filter parsing/defaults, and currency/date/number formatting. For manual verification, check filtering, search, sorting, pagination, direct links, browser back/forward, empty results, out-of-range pages, error/retry behavior, and layouts at desktop, tablet, and phone sizes.