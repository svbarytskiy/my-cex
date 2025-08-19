import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import axiosInstance from '../../../api/axios'
import { wsTradeClient } from '../../../api/WebSocketClient'
import {
  setDepthData,
  setWsConnected,
  setError,
  resetDepthState,
  setLoading,
  setSymbol,
} from './depthSlice'
import { depthProcessor } from './depthProcessor'
import { DepthEvent, DepthLevel, ProcessedDepthData } from './types'

export const fetchDepth = createAsyncThunk<
  ProcessedDepthData,
  { symbol: string },
  { state: RootState; dispatch: any }
>('depth/fetch', async ({ symbol }, { dispatch }) => {
  dispatch(resetDepthState())
  depthProcessor.reset()
  dispatch(setLoading(true))
  dispatch(setSymbol(symbol.toUpperCase()))

  const currentSymbolInState = symbol.toUpperCase()

  try {
    const { data } = await axiosInstance.get('/depth', {
      params: { symbol: currentSymbolInState, limit: 1000 },
    })

    const processedData = depthProcessor.initializeSnapshot(
      data.bids as DepthLevel[],
      data.asks as DepthLevel[],
      data.lastUpdateId,
    )

    return processedData
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to fetch depth snapshot.'))
    throw error
  }
})

export const subscribeDepthWS = createAsyncThunk<
  void,
  string,
  { state: RootState; dispatch: any }
>('depth/subscribe', async (symbol, { dispatch, getState }) => {
  dispatch(setWsConnected(true))

  const streamName = `${symbol.toLowerCase()}@depth@1000ms`

  wsTradeClient.subscribe(streamName, (msg: any) => {
    if (msg.e === 'depthUpdate' && msg.b && msg.a) {
      const event: DepthEvent = {
        U: msg.U,
        u: msg.u,
        b: msg.b as DepthLevel[],
        a: msg.a as DepthLevel[],
        s: msg.s,
      }
      const processedData = depthProcessor.processWsEvent(event)

      if (processedData === null) {
        const currentSymbolFromState = getState().depth.symbol
        if (currentSymbolFromState) {
          dispatch(fetchDepth({ symbol: currentSymbolFromState }))
        }
      } else {
        dispatch(setDepthData(processedData))
      }
    }
  })
})

export const unsubscribeDepthWS = createAsyncThunk<void, string>(
  'depth/unsubscribe',
  async (symbol, { dispatch }) => {
    const stream = `${symbol.toLowerCase()}@depth@1000ms`
    wsTradeClient.unsubscribe(stream)
    dispatch(setWsConnected(false))
    dispatch(resetDepthState())
    depthProcessor.reset()
  },
)
