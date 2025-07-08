type WSCallback = (data: any) => void

// interface Subscription {
//   stream: string
//   callback: WSCallback
// }

export class WebSocketClient {
  private socket: WebSocket | null = null
  private subscriptions: Record<string, WSCallback[]> = {}
  private streams: Set<string> = new Set()
  private reconnectTimeout = 3000
  public isConnected = false

  constructor(private baseUrl: string) {
    this.rebuildSocket()
  }

  private rebuildSocket() {
    if (this.socket) {
      this.socket.onclose = null
      this.socket.onerror = null
      this.socket.close()
    }

    // Формуємо шлях: baseUrl?streams=stream1/stream2/...
    const streamsParam = Array.from(this.streams).join('/')
    const url = streamsParam
      ? `${this.baseUrl}?streams=${streamsParam}`
      : this.baseUrl

    this.socket = new WebSocket(url)
    this.socket.onopen = () => {
      this.isConnected = true
      console.log('[WS] Connected to:', url)
    }
    this.socket.onmessage = e => this.handleMessage(e)
    this.socket.onclose = () => {
      this.isConnected = false
      console.warn(
        '[WS] Disconnected, reconnect in',
        this.reconnectTimeout,
        'ms',
      )
      setTimeout(() => this.rebuildSocket(), this.reconnectTimeout)
    }
    this.socket.onerror = err => {
      console.error('[WS] Error', err)
      this.socket?.close()
    }
  }

  private handleMessage(event: MessageEvent) {
    // Binance combined streams шле { stream: string, data: any }
    const msg = JSON.parse(event.data) as { stream: string; data: any }
    const cbs = this.subscriptions[msg.stream] || []
    cbs.forEach(cb => cb(msg.data))
  }

  subscribe(stream: string, cb: WSCallback) {
    if (!this.subscriptions[stream]) {
      this.subscriptions[stream] = []
      this.streams.add(stream)
      this.rebuildSocket()
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
      this.rebuildSocket()
    }
  }
}

export const wsTradeClient = new WebSocketClient(
  'wss://stream.binance.com:9443/stream',
)
