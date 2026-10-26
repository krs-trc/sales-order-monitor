// Shapes of the mock API responses

export interface Order {
    SalesId: string
    SalesName: string
    CustAccount: string
    InventSiteId: string
    SalesStatus: string
    CreatedDateTime1: string
    HAR_TotalSOAmount: number
    SalesTaker?: string
    CustomerRef?: string
}

export interface Summary {
    total_orders: number
    filtered_orders: number
    open_orders: number
    invoiced_orders: number
    delivered_orders: number
    cancelled_orders: number
    total_order_value: number
}

export interface OrdersResponse {
    summary: Summary
    page: number
    pageSize: number
    total: number
    totalPages: number
    sort: string
    order: 'asc' | 'desc'
    data: Order[]
}

export interface Facet {
    value: string
    count: number
}

export interface Meta {
    facets: {
        statuses: Facet[]
        sites: Facet[]
    }
}

export const SORT_KEYS = [
    'SalesId',
    'CreatedDateTime1',
    'HAR_TotalSOAmount',
    'SalesStatus',
    'InventSiteId',
] as const

export type SortKey = (typeof SORT_KEYS)[number]
export type SortOrder = 'asc' | 'desc'