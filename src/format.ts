// Currency Formatter for Malaysian Ringgit (MYR)
const currency = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' })
const integer = new Intl.NumberFormat('en-MY')

// Date Formatter for Malaysia (Asia/Kuala_Lumpur)
const dateFmt = new Intl.DateTimeFormat('en-MY', {
    dateStyle: 'medium',
    timeZone: 'Asia/Kuala_Lumpur',
})

export const formatCurrency = (n: number): string => currency.format(n)
export const formatInt = (n: number): string => integer.format(n)

export function formatDate(iso: string): string {
    const d = new Date(iso)
    return Number.isNaN(d.getTime()) ? '-' : dateFmt.format(d)
}