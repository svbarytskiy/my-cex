/* src/features/orderBook/orderBookThunks.ts */
import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../http/axios'
import { RootState, store } from '../../store'
import { wsTradeClient } from '../../../core/ws/WebSocketClient'
import { updateOrderBook, setWsConnected } from './orderBookSlice'
import type { SnapshotPayload, DepthEvent } from './types'

function createPackedBuffer(data: [string, string][]): ArrayBuffer {
  const buffer = new ArrayBuffer(
    Float64Array.BYTES_PER_ELEMENT * data.length * 2,
  )
  const view = new Float64Array(buffer)
  for (let i = 0; i < data.length; i++) {
    view[i * 2] = parseFloat(data[i][0])
    view[i * 2 + 1] = parseFloat(data[i][1])
  }
  return buffer
}

const worker = new Worker(
  new URL('../../../workers/orderbook.worker.ts', import.meta.url),
  { type: 'module' },
)
let currentSymbol: string | null = null

worker.onmessage = ({ data }) => {
  if (data.type === 'UPDATE') {
    const { payload } = data
    console.log(`Transfer time: ${payload.transferTime.toFixed(2)} ms`)
    console.log(
      `Processing time in worker: ${payload.processingTime.toFixed(2)} ms`,
    )
    store.dispatch(updateOrderBook(payload))
  } else if (data.type === 'RESYNC') {
    if (currentSymbol) {
      store.dispatch(fetchOrderBook({ symbol: currentSymbol }))
    }
  }
}

export const fetchOrderBook = createAsyncThunk<
  SnapshotPayload & { symbol: string },
  { symbol: string },
  { state: RootState }
>('orderbook/fetch', async ({ symbol }) => {
  currentSymbol = symbol.toUpperCase()
  const { data } = await axiosInstance.get('/depth', {
    params: { symbol: currentSymbol, limit: 1000 },
  })
  const sendTime = Date.now()
  const bidsPacked = createPackedBuffer(data.bids)
  const asksPacked = createPackedBuffer(data.asks)

  worker.postMessage(
    {
      type: 'SNAPSHOT',
      payload: {
        lastUpdateId: data.lastUpdateId,
        bidsBuffer: bidsPacked,
        asksBuffer: asksPacked,
        sendTime,
      },
    },
    [bidsPacked, asksPacked],
  )
  return { lastUpdateId: data.lastUpdateId, symbol: currentSymbol }
})

export const subscribeOrderBookWS = createAsyncThunk<void, string>(
  'orderbook/subscribe',
  async (symbol, { dispatch }) => {
    dispatch(setWsConnected(true))
    currentSymbol = symbol.toUpperCase()

    const streamName = `${symbol.toLowerCase()}@depth@1000ms`
    wsTradeClient.subscribe(streamName, (msg: any) => {
      if (msg.e === 'depthUpdate' && msg.b && msg.a) {
        const event: DepthEvent = {
          U: msg.U,
          u: msg.u,
          b: msg.b,
          a: msg.a,
        }

        const bidsPacked = createPackedBuffer(event.b)
        const asksPacked = createPackedBuffer(event.a)
        console.log(
          `Sending WS event for ${symbol}: U=${event.U}, u=${event.u}, bids=${event.b.length}, asks=${event.a.length}`,
        )
        const sendTime = Date.now()
        worker.postMessage(
          {
            type: 'WS_EVENT',
            payload: {
              U: event.U,
              u: event.u,
              bidsBuffer: bidsPacked,
              asksBuffer: asksPacked,
              sendTime,
            },
          },
          [bidsPacked, asksPacked],
        )
      }
    })
  },
)

export const unsubscribeOrderBookWS = createAsyncThunk<void, string>(
  'orderbook/unsubscribe',
  async symbol => {
    const stream = `${symbol.toLowerCase()}@depth@1000ms`
    wsTradeClient.unsubscribe(stream)
    store.dispatch(setWsConnected(false))
  },
)
