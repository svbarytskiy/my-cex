export type KlineInterval = 
  | '1s' | '1m' | '3m' | '5m' | '15m' | '30m'
  | '1h' | '4h' | '1d' | '1w' | '1M';

export interface KlineMessage {
  e: string;
  E: number;
  s: string;
  k: {
    t: number;
    T: number;
    s: string;
    i: KlineInterval;
    o: string;
    c: string;
    h: string;
    l: string;
    v: string;
    x: boolean;

  };
}