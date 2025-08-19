import { DepthEvent, DepthLevel, ProcessedDepthData } from './types'

class DepthProcessor {
  private currentBidsMap: Record<string, string> = {}
  private currentAsksMap: Record<string, string> = {}
  private currentLastUpdateId: number = 0
  private updateBuffer: DepthEvent[] = []
  private isSnapshotInitialized: boolean = false
  // private limit: number = 500

  constructor() {
    // this.limit = limit
  }

  private applyDepthEvent(event: DepthEvent) {
    event.b.forEach(([p, q]) => {
      const qty = parseFloat(q)
      if (qty === 0) {
        delete this.currentBidsMap[p]
      } else {
        this.currentBidsMap[p] = q
      }
    })

    event.a.forEach(([p, q]) => {
      const qty = parseFloat(q)
      if (qty === 0) {
        delete this.currentAsksMap[p]
      } else {
        this.currentAsksMap[p] = q
      }
    })

    this.currentLastUpdateId = event.u
  }

  private trimOrderBook() {
    // const sortedBids = this.getSortedDepthLevels(this.currentBidsMap, 'bid');
    // const sortedAsks = this.getSortedDepthLevels(this.currentAsksMap, 'ask');
    // this.currentBidsMap = Object.fromEntries(sortedBids.slice(0, this.limit));
    // this.currentAsksMap = Object.fromEntries(sortedAsks.slice(0, this.limit));
  }

  private getSortedDepthLevels(
    map: Record<string, string>,
    type: 'bid' | 'ask',
  ): DepthLevel[] {
    const result: DepthLevel[] = Object.entries(map) as DepthLevel[]

    if (type === 'bid') {
      return result.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
    } else {
      return result.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
    }
  }

  public getCurrentProcessedData(): ProcessedDepthData {
    return {
      bids: this.getSortedDepthLevels(this.currentBidsMap, 'bid'),
      asks: this.getSortedDepthLevels(this.currentAsksMap, 'ask'),
      lastUpdateId: this.currentLastUpdateId,
    }
  }

  public initializeSnapshot(
    snapshotBids: DepthLevel[],
    snapshotAsks: DepthLevel[],
    lastId: number,
  ): ProcessedDepthData {
    this.currentBidsMap = Object.fromEntries(snapshotBids)
    this.currentAsksMap = Object.fromEntries(snapshotAsks)
    this.currentLastUpdateId = lastId
    this.isSnapshotInitialized = true
    const relevantBufferedUpdates = this.updateBuffer
      .filter(event => event.u > this.currentLastUpdateId)
      .sort((e1, e2) => e1.U - e2.U)
    relevantBufferedUpdates.forEach(this.applyDepthEvent.bind(this))
    this.updateBuffer = []

    this.trimOrderBook()
    return this.getCurrentProcessedData()
  }

  public processWsEvent(event: DepthEvent): ProcessedDepthData | null {
    if (!this.isSnapshotInitialized) {
      this.updateBuffer.push(event)
      return null
    }

    if (event.U > this.currentLastUpdateId + 1) {
      console.warn(
        `Depth data out of sync. Requesting new snapshot. Expected U: ${this.currentLastUpdateId + 1}, Got: ${event.U}`,
      )
      this.isSnapshotInitialized = false
      this.updateBuffer = []
      return null
    }

    if (event.u <= this.currentLastUpdateId) {
      return this.getCurrentProcessedData()
    }

    this.applyDepthEvent(event)
    this.trimOrderBook()
    return this.getCurrentProcessedData()
  }

  public reset() {
    this.currentBidsMap = {}
    this.currentAsksMap = {}
    this.currentLastUpdateId = 0
    this.updateBuffer = []
    this.isSnapshotInitialized = false
  }
}

export const depthProcessor = new DepthProcessor()
