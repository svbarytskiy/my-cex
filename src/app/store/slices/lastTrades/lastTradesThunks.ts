import { createAsyncThunk } from '@reduxjs/toolkit'
import { registerStream } from '../../../api/streamRegistry'
import { wsTradeClient } from '../../../api/WebSocketClient'
import axiosInstance from '../../../api/axios'
import type { RootState } from '../../store'

export const fetchInitialTrades = createAsyncThunk(
  'trades/fetchInitialTrades',
  async (symbol: string = 'BTCUSDT', { rejectWithValue }) => {
    try {
      const currentSymbol = symbol.toUpperCase()
      const { data } = await axiosInstance.get('/aggTrades', {
        params: { symbol: currentSymbol, limit: 50 },
      })

      const parsedData = data.map((trade: any) => ({
        id: trade.a,
        price: trade.p,
        qty: trade.q,
        quoteQty: trade.q * trade.p,
        time: trade.T,
        isBuyerMaker: trade.m,
        isBestMatch: trade.M,
      }))

      return parsedData
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  },
)
export const subscribeLastTradesWS = createAsyncThunk<
  void,
  { symbol: string },
  { state: RootState }
>('lastTrades/subscribe', async ({ symbol }) => {
  // const streamName = `${symbol.toLowerCase()}@aggTrade`
  const { stream, onMessage } = registerStream<'aggTrade'>('aggTrade', symbol)
  wsTradeClient.subscribe(stream, onMessage)
})

export const unsubscribeLastTradesWS = createAsyncThunk<void, string>(
  'lastTrades/unsubscribe',
  async symbol => {
    const stream = `${symbol.toLowerCase()}@aggTrade`
    wsTradeClient.unsubscribe(stream)
  },
)
