import type { Meta, OrdersResponse } from './types'

const BASE = import.meta.env.VITE_API_BASE as string | undefined
const KEY = import.meta.env.VITE_API_KEY as string | undefined

export class ApiError extends Error {
    status?: number
    constructor(message: string, status?: number) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
    if (!BASE || !KEY) {
        throw new ApiError('App is not configured: VITE_API_BASE and VITE_API_KEY are missing.')
    }

    let res: Response
    try {
        res = await fetch(`${BASE}${path}`, { headers: { 'x-assessment-key': KEY }, signal })
    } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') throw err
        throw new ApiError('Could not reach the server. Check your connection and try again.')
    }

    if (!res.ok) {
        throw new ApiError(
            res.status === 404 ? 'Not found. ' : `The server returned an error (${res.status}).`, res.status,
        )
    }

    return (await res.json()) as T
}

export const fetchOrders = (query: string, signal?: AbortSignal) => get<OrdersResponse>(`?${query}`, signal)

export const fetchMeta = (signal?: AbortSignal) => get<Meta>('/meta', signal)

export function errorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Something went wrong.'
}