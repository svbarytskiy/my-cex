// workers/orderbook.worker.ts

export type DepthEvent = {
    U: number;                // firstUpdateId
    u: number;                // finalUpdateId
    b: [string, string][];    // bids updates
    a: [string, string][];    // asks updates
};

type SnapshotMessage = {
    type: 'SNAPSHOT';
    payload: {
        lastUpdateId: number;
        bids: [string, string][];
        asks: [string, string][];
    };
};

type WsMessage = {
    type: 'WS_EVENT';
    payload: DepthEvent;
};

type WorkerMessage = SnapshotMessage | WsMessage;

let bidsMap: Record<string, string> = {};
let asksMap: Record<string, string> = {};
let lastUpdateId = 0;
let buffer: DepthEvent[] = [];
let isInitialized = false;

self.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
    switch (data.type) {
        case 'SNAPSHOT':
            bidsMap = Object.fromEntries(data.payload.bids);
            asksMap = Object.fromEntries(data.payload.asks);
            lastUpdateId = data.payload.lastUpdateId;

            buffer
                .sort((e1, e2) => e1.U - e2.U)
                .forEach(applyEvent);
            buffer = [];
            isInitialized = true;
            postUpdate();
            break;

        case 'WS_EVENT':
            const e = data.payload;
            if (!isInitialized) {
                buffer.push(e);
            } else if (e.U === lastUpdateId + 1) {
                applyEvent(e);
                postUpdate();
            } else if (e.U > lastUpdateId + 1) {
                // розсинхронізація — попросимо ресинк
                isInitialized = false;
                buffer = [];
                postMessage({ type: 'RESYNC' });
            }
            break;
    }
};

function applyEvent(e: DepthEvent) {
    e.b.forEach(([p, q]) => {
        const qty = parseFloat(q);
        if (qty === 0) delete bidsMap[p];
        else bidsMap[p] = q;
    });
    e.a.forEach(([p, q]) => {
        const qty = parseFloat(q);
        if (qty === 0) delete asksMap[p];
        else asksMap[p] = q;
    });
    lastUpdateId = e.u;
}

function postUpdate() {
    const bids = Object.entries(bidsMap)
        .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
    const asks = Object.entries(asksMap)
        .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
    postMessage({
        type: 'UPDATE',
        payload: { bids, asks, lastUpdateId },
    });
}
