import { createAsyncThunk } from '@reduxjs/toolkit'

import { RootState } from '../../store'
import { setWsConnected } from './tickerSlice'
import { registerStream } from 'app/api/streamRegistry'
import { wsTradeClient } from 'app/api/WebSocketClient'

export const subscribeTickerkWS = createAsyncThunk<
  void,
  string,
  { state: RootState }
>('ticker/subscribe', async (symbol, { dispatch }) => {
  const { stream, onMessage } = registerStream<'ticker'>('ticker', symbol)
  wsTradeClient.subscribe(stream, onMessage)
  dispatch(setWsConnected(true))
})

export const unsubscribeTickerWS = createAsyncThunk(
  'ticker/unsubscribe',
  async (symbol: string, { dispatch }) => {
    const stream = `${symbol.toLowerCase()}@ticker`
    wsTradeClient.unsubscribe(stream)
    dispatch(setWsConnected(false))
  },
)
