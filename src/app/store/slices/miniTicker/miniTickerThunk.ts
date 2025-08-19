import { createAsyncThunk } from '@reduxjs/toolkit'
import { registerStream } from '../../../api/streamRegistry'
import { wsTradeClient } from '../../../api/WebSocketClient'
import { AppDispatch, RootState } from '../../store'
import { setError, setLoading, setWsConnected } from './miniTickerSlice'
import { MiniTicker, Ticker24hrResponse } from './types'
import axiosInstance from '../../../api/axios'

export const fetchInitialMiniTickers = createAsyncThunk<
  MiniTicker[],
  void,
  { state: RootState; dispatch: AppDispatch }
>('miniTicker/fetchInitial', async (_, { rejectWithValue, dispatch }) => {
  dispatch(setLoading(true))
  try {
    const response =
      await axiosInstance.get<Ticker24hrResponse[]>('/ticker/24hr')
    const rawData = response.data

    const transformedData: MiniTicker[] = rawData.map(item => ({
      symbol: item.symbol,
      close: parseFloat(item.lastPrice),
      open: parseFloat(item.openPrice),
      high: parseFloat(item.highPrice),
      low: parseFloat(item.lowPrice),
      volume: parseFloat(item.volume),
      quoteVolume: parseFloat(item.quoteVolume),
      percentChange: parseFloat(item.priceChangePercent),
    }))

    dispatch(setError(null))
    return transformedData
  } catch (error: any) {
    const errorMessage = 'Unknown error while fetching mini tickers' + error
    dispatch(setError(errorMessage))
    return rejectWithValue(errorMessage)
  } finally {
    dispatch(setLoading(false))
  }
})

export const subscribeMiniTickerWS = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('miniTicker/subscribe', async (_, { dispatch }) => {
  const { stream, onMessage } = registerStream<'miniTicker'>('miniTicker')
  wsTradeClient.subscribe(stream, onMessage)
  dispatch(setWsConnected(true))
})

export const unsubscribeMiniTickerWS = createAsyncThunk(
  'miniTicker/unsubscribe',
  async (symbol: string, { dispatch }) => {
    const stream = `${symbol.toLowerCase()}!miniTicker@arr`
    wsTradeClient.unsubscribe(stream)
    dispatch(setWsConnected(false))
  },
)
