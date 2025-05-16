import { createAsyncThunk } from "@reduxjs/toolkit";
import { registerStream } from "../../../core/ws/streamRegistry";
import { wsTradeClient } from "../../../core/ws/WebSocketClient";
import { RootState } from "../../store";
import { setWsConnected } from "./tickerSlice";

export const subscribeTickerkWS = createAsyncThunk<
    void,
    string,
    { state: RootState }
>("ticker/subscribe", async (symbol, { dispatch }) => {
    const { stream, onMessage } = registerStream<'ticker'>("ticker", symbol);
    wsTradeClient.subscribe(stream, onMessage);
    dispatch(setWsConnected(true));
});

export const unsubscribeTickerWS = createAsyncThunk(
    "ticker/unsubscribe",
    async (symbol: string, { dispatch }) => {
        const stream = `${symbol.toLowerCase()}@ticker`;
        wsTradeClient.unsubscribe(stream);
        dispatch(setWsConnected(false));
    }
);

