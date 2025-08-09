import { AggregatedTradePair } from './miniTickerSelector'

type FilterRule = (pair: AggregatedTradePair) => boolean

export const TAB_FILTER_RULES: { [key: string]: FilterRule } = {
  FAVORITES: (pair: AggregatedTradePair) => pair.isFavorite,
  USDT: pair => pair.quoteAsset === 'USDT',
  USDC: pair => pair.quoteAsset === 'USDC',
  FDUSD: pair => pair.quoteAsset === 'FDUSD',
  BNB: pair => pair.quoteAsset === 'BNB',
  BTC: pair => pair.quoteAsset === 'BTC',

  ALTS: pair =>
    !['USDT', 'USDC', 'FDUSD', 'BNB', 'BTC'].includes(pair.quoteAsset),

  alts_ETH: pair => pair.quoteAsset === 'ETH',
  alts_TUSD: pair => pair.quoteAsset === 'TUSD',
  alts_DAI: pair => pair.quoteAsset === 'DAI',
  alts_XRP: pair => pair.quoteAsset === 'XRP',
  alts_TRX: pair => pair.quoteAsset === 'TRX',
  alts_DOGE: pair => pair.quoteAsset === 'DOGE',
  alts_EURI: pair => pair.quoteAsset === 'EURI',
  alts_SOL: pair => pair.quoteAsset === 'SOL',

  FIAT: pair =>
    [
      'TRY',
      'EUR',
      'BRL',
      'ARS',
      'COP',
      'CZK',
      'JPY',
      'MXN',
      'PLN',
      'RON',
      'UAH',
      'ZAR',
    ].includes(pair.quoteAsset),

  fiat_TRY: pair => pair.quoteAsset === 'TRY',
  fiat_EUR: pair => pair.quoteAsset === 'EUR',
  fiat_BRL: pair => pair.quoteAsset === 'BRL',
  fiat_ARS: pair => pair.quoteAsset === 'ARS',
  fiat_COP: pair => pair.quoteAsset === 'COP',
  fiat_CZK: pair => pair.quoteAsset === 'CZK',
  fiat_JPY: pair => pair.quoteAsset === 'JPY',
  fiat_MXN: pair => pair.quoteAsset === 'MXN',
  fiat_PLN: pair => pair.quoteAsset === 'PLN',
  fiat_RON: pair => pair.quoteAsset === 'RON',
  fiat_UAH: pair => pair.quoteAsset === 'UAH',
  fiat_ZAR: pair => pair.quoteAsset === 'ZAR',

  Margin: pair => pair.isMarginTradingAllowed,
}
