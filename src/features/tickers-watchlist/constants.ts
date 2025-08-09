export const TABS = [
  { id: 'FAVORITES', label: 'Favorite' },
  { id: 'USDT', label: 'USDT' },
  { id: 'USDC', label: 'USDC' },
  { id: 'FDUSD', label: 'FDUSD' },
  { id: 'BNB', label: 'BNB' },
  { id: 'BTC', label: 'BTC' },
  {
    id: 'ALTS',
    label: 'ALTS',
    subTabs: [
      { id: 'alts_ETH', label: 'ETH' },
      { id: 'alts_TUSD', label: 'TUSD' },
      { id: 'alts_DAI', label: 'DAI' },
      { id: 'alts_XRP', label: 'XRP' },
      { id: 'alts_TRX', label: 'TRX' },
      { id: 'alts_DOGE', label: 'DOGE' },
      { id: 'alts_EURI', label: 'EURI' },
      { id: 'alts_SOL', label: 'SOL' },
    ],
  },
  {
    id: 'FIAT',
    label: 'FIAT',
    subTabs: [
      { id: 'fiat_TRY', label: 'TRY' },
      { id: 'fiat_EUR', label: 'EUR' },
      { id: 'fiat_BRL', label: 'BRL' },
      { id: 'fiat_ARS', label: 'ARS' },
      { id: 'fiat_COP', label: 'COP' },
      { id: 'fiat_CZK', label: 'CZK' },
      { id: 'fiat_JPY', label: 'JPY' },
      { id: 'fiat_MXN', label: 'MXN' },
      { id: 'fiat_PLN', label: 'PLN' },
      { id: 'fiat_RON', label: 'RON' },
      { id: 'fiat_UAH', label: 'UAH' },
      { id: 'fiat_ZAR', label: 'ZAR' },
    ],
  },
  {
    id: 'Margin',
    label: 'Margin',
  },
]

export const COLUMNS_DEFINITIONS = {
  pair: {
    id: 'pair',
    label: 'Pair',
    sortable: true,
  },
  volume: {
    id: 'volume',
    label: 'Vol',
    sortable: true,
  },
  lastPrice: {
    id: 'lastPrice',
    label: 'Last Price',
    sortable: true,
  },
  change24h: {
    id: 'change24h',
    label: '24h Change',
    sortable: true,
  },
} as const
