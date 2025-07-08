// --- Unpack helper: ArrayBuffer -> [price, qty][] ---
function unpackDepth(buffer: ArrayBuffer): [string, string][] {
  const view = new Float64Array(buffer)
  const result: [string, string][] = []
  for (let i = 0; i < view.length; i += 2) {
    result.push([view[i].toString(), view[i + 1].toString()])
  }
  return result
}

// !!! Оновлені типи для ArrayBuffer. Скопіюйте ці типи сюди, якщо вони не імпортуються !!!
type DepthEventPacked = {
  U: number
  u: number
  bidsBuffer: ArrayBuffer
  asksBuffer: ArrayBuffer
  sendTime: number
}

type SnapshotMessage = {
  type: 'SNAPSHOT'
  payload: {
    lastUpdateId: number
    bidsBuffer: ArrayBuffer
    asksBuffer: ArrayBuffer
    sendTime: number
  }
}

type WsMessage = {
  type: 'WS_EVENT'
  payload: DepthEventPacked
}

type WorkerMessage = SnapshotMessage | WsMessage

let bidsMap: Record<string, string> = {}
let asksMap: Record<string, string> = {}
let lastUpdateId = 0
let buffer: DepthEventPacked[] = []
let isInitialized = false

self.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
  const receiveTime = Date.now()
  const transferTime = receiveTime - data.payload.sendTime
  switch (data.type) {
    case 'SNAPSHOT': {
      const { lastUpdateId: id, bidsBuffer, asksBuffer } = data.payload
      // Розпаковуємо дані з буферів
      bidsMap = Object.fromEntries(unpackDepth(bidsBuffer))
      asksMap = Object.fromEntries(unpackDepth(asksBuffer))
      lastUpdateId = id

      buffer.sort((e1, e2) => e1.U - e2.U).forEach(applyPackedEvent)
      buffer = []
      isInitialized = true
      postUpdate(transferTime, receiveTime)
      break
    }
    case 'WS_EVENT': {
      const e = data.payload
      if (!isInitialized) {
        buffer.push(e)
      } else if (e.U === lastUpdateId + 1) {
        applyPackedEvent(e)
        postUpdate(transferTime, receiveTime)
      } else if (e.U > lastUpdateId + 1) {
        isInitialized = false
        buffer = []
        postMessage({ type: 'RESYNC' })
      }
      break
    }
  }
}

function applyPackedEvent(e: DepthEventPacked) {
  const bids = unpackDepth(e.bidsBuffer)
  const asks = unpackDepth(e.asksBuffer)

  bids.forEach(([p, q]) => {
    const qty = parseFloat(q)
    if (qty === 0) delete bidsMap[p]
    else bidsMap[p] = q
  })
  asks.forEach(([p, q]) => {
    const qty = parseFloat(q)
    if (qty === 0) delete asksMap[p]
    else asksMap[p] = q
  })

  lastUpdateId = e.u
}

function postUpdate(transferTime: number, receiveTime: number) {
  const bids = Object.entries(bidsMap).sort(
    (a, b) => parseFloat(b[0]) - parseFloat(a[0]),
  )
  const asks = Object.entries(asksMap).sort(
    (a, b) => parseFloat(a[0]) - parseFloat(b[0]),
  )
  const processingTime = Date.now() - receiveTime
  postMessage({
    type: 'UPDATE',
    payload: { bids, asks, lastUpdateId, transferTime, processingTime },
  })
}
