import { KlineMessage, KlineInterval } from "../types/kline";

export class BinanceWebSocket {
  private socket: WebSocket | null = null;
  private handlers = new Map<string, (data: KlineMessage) => void>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private pendingSubscriptions: string[] = [];

  constructor(private baseUrl = 'wss://stream.binance.com:9443/stream') {
    this.initializeSocket();
  }

  private initializeSocket() {
    this.socket = new WebSocket(this.baseUrl);
    this.setupEventListeners(); 
    
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      console.log('WebSocket connected');
      this.sendPendingSubscriptions();
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.stream) {
        const handler = this.handlers.get(message.stream);
        if (handler) handler(message.data);
      }
    };

    this.socket.onclose = (event) => {
      if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.reconnect();
    };
  }

  private sendPendingSubscriptions() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      for (const stream of this.pendingSubscriptions) {
        this.socket.send(JSON.stringify({
          method: "SUBSCRIBE",
          params: [stream],
          id: Date.now()
        }));
      }
      this.pendingSubscriptions = [];
    }
  }

  subscribe(
    symbol: string,
    interval: KlineInterval,
    callback: (data: KlineMessage) => void
  ) {
    const stream = `${symbol.toLowerCase()}@kline_${interval}`;

    if (this.handlers.has(stream)) return;

    this.handlers.set(stream, callback);

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        method: "SUBSCRIBE",
        params: [stream],
        id: Date.now()
      }));
    } else {
      this.pendingSubscriptions.push(stream);
    }
  }

  unsubscribe(symbol: string, interval: KlineInterval) {
    const stream = `${symbol.toLowerCase()}@kline_${interval}`;
    const params = [stream];

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        method: "UNSUBSCRIBE",
        params,
        id: Date.now()
      }));
    }

    this.handlers.delete(stream);
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    this.reconnectAttempts++;
    setTimeout(() => {
      console.log(`Reconnecting attempt ${this.reconnectAttempts}`);
      this.initializeSocket();
      this.resubscribeAll();
    }, 1000 * Math.pow(2, this.reconnectAttempts));
  }

  private resubscribeAll() {
    const streams = Array.from(this.handlers.keys());
    if (streams.length > 0 && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        method: "SUBSCRIBE",
        params: streams,
        id: Date.now()
      }));
    } else {
      this.pendingSubscriptions.push(...streams);
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.handlers.clear();
    }
  }
}