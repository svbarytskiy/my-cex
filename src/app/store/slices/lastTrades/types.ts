export default interface Trade {
  id: number
  price: string
  qty: string
  quoteQty: number
  time: number
  isBuyerMaker: boolean
  isBestMatch: boolean
}
