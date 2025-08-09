import { useParams } from 'react-router-dom'

export const useUrlTradePair = () => {
  const { symbol } = useParams<{ symbol?: string }>()

  if (!symbol) {
    return null
  }

  const parts = symbol.split('_')
  const baseAsset = parts[0].toUpperCase()
  const quoteAsset = parts[1].toUpperCase()
  return { symbol: baseAsset + quoteAsset, baseAsset, quoteAsset }
}
