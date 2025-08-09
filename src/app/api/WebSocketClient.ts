type WSCallback = (data: any) => void

export class WebSocketClient {
  private socket: WebSocket | null = null
  private subscriptions: Record<string, WSCallback[]> = {}
  private streams: Set<string> = new Set()
  private reconnectTimeout = 3000
  public isConnected = false
  private reconnectTimer?: number

  constructor(private baseUrl: string) {
    this.connect()
  }

  private connect() {
    this.socket = new WebSocket(this.baseUrl)

    this.socket.onopen = () => {
      this.isConnected = true
      console.log('[WS] Connected')
      if (this.streams.size) {
        this.sendSubscribe(Array.from(this.streams))
      }
    }

    this.socket.onmessage = e => this.handleMessage(e)

    this.socket.onclose = () => {
      this.isConnected = false
      console.warn('[WS] Disconnected — reconnect in', this.reconnectTimeout, 'ms')
      this.reconnectTimer = setTimeout(() => this.connect(), this.reconnectTimeout)
    }

    this.socket.onerror = err => {
      console.error('[WS] Error', err)
      this.socket?.close()
    }
  }

  private sendSubscribe(streams: string[]) {
    if (this.socket?.readyState === WebSocket.OPEN && streams.length) {
      this.socket.send(
        JSON.stringify({
          method: 'SUBSCRIBE',
          params: streams,
          id: Date.now(),
        }),
      )
    }
  }

  private sendUnsubscribe(streams: string[]) {
    if (this.socket?.readyState === WebSocket.OPEN && streams.length) {
      this.socket.send(
        JSON.stringify({
          method: 'UNSUBSCRIBE',
          params: streams,
          id: Date.now(),
        }),
      )
    }
  }

  private handleMessage(event: MessageEvent) {
    const msg = JSON.parse(event.data)
    if (msg.result !== undefined && msg.id !== undefined) return

    let streamKey: string
    let data: any

    if (msg.stream && msg.data) {
      streamKey = msg.stream
      data = msg.data
    } else if (msg.e && msg.s) {
      streamKey = `${msg.s.toLowerCase()}@${msg.e}`
      data = msg
    } else {
      return
    }

    const cbs = this.subscriptions[streamKey] ?? []
    cbs.forEach(cb => cb(data))
  }

  subscribe(stream: string, cb: WSCallback) {
    const isNew = !this.subscriptions[stream]
    if (isNew) {
      this.subscriptions[stream] = []
      this.streams.add(stream)
      this.sendSubscribe([stream])
    }
    this.subscriptions[stream].push(cb)
  }

  unsubscribe(stream: string, cb?: WSCallback) {
    const subs = this.subscriptions[stream]
    if (!subs) return

    if (cb) {
      this.subscriptions[stream] = subs.filter(x => x !== cb)
    } else {
      delete this.subscriptions[stream]
    }

    if (!this.subscriptions[stream]?.length) {
      delete this.subscriptions[stream]
      this.streams.delete(stream)
      this.sendUnsubscribe([stream])
    }
  }
}

export const wsTradeClient = new WebSocketClient(
  'wss://stream.binance.com:9443/stream',
)
