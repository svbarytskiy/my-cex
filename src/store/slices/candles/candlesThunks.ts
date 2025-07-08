import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { Candle, FetchCandlesParams, FetchCandlesResponse } from './types'
import { markWsSubscribed } from './candlesSlice'
import axiosInstance from '../../../http/axios'
import { wsTradeClient } from '../../../core/ws/WebSocketClient'
import { registerStream } from '../../../core/ws/streamRegistry'

export const fetchCandles = createAsyncThunk<
  FetchCandlesResponse,
  FetchCandlesParams
>('candles/fetch', async ({ symbol, interval }) => {
  const params = new URLSearchParams({
    symbol: symbol.toUpperCase(),
    interval,
    limit: '500',
  })

  const { data } = await axiosInstance.get(`/klines?${params}`)
  const candles: Candle[] = data.map((c: Array<string>) => ({
    time: Math.floor(Number(c[0]) / 1000),
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
    volume: parseFloat(c[5]),
  }))

  return { key: `${symbol}_${interval}`, candles }
})

export const subscribeWS = createAsyncThunk<
  void,
  FetchCandlesParams,
  { state: RootState }
>('candles/subscribe', async ({ symbol, interval }, { dispatch }) => {
  const streamName = `${symbol}_${interval}`
  const { stream, onMessage } = registerStream<'kline'>('kline', symbol, {
    interval,
  })
  wsTradeClient.subscribe(stream, onMessage)
  if (wsTradeClient.isConnected) {
    dispatch(markWsSubscribed(streamName))
  }
})

export const unsubscribeWS = createAsyncThunk(
  'candles/unsubscribe',
  async ({ symbol, interval }: FetchCandlesParams) => {
    const stream = `${symbol.toLowerCase()}@kline_${interval}`
    wsTradeClient.unsubscribe(stream)
  },
)
