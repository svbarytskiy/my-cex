import { createAsyncThunk } from '@reduxjs/toolkit'
import { registerStream } from '../../../core/ws/streamRegistry'
import { wsTradeClient } from '../../../core/ws/WebSocketClient'
import axiosInstance from '../../../http/axios'
import { RootState } from '../../store'

export const fetchInitialTrades = createAsyncThunk(
  'trades/fetchInitialTrades',
  async (symbol: string = 'BTCUSDT', { rejectWithValue }) => {
    try {
      const currentSymbol = symbol.toUpperCase()
      const { data } = await axiosInstance.get('/aggTrades', {
        params: { symbol: currentSymbol, limit: 50 },
      })
      return data
    } catch (error) {
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
