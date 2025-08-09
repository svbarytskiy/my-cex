import { Layout } from 'common/components/layout/Layout'
import { NotFoundPage } from 'pages/notFound/NotFoundPage'
import { ErrorPage } from 'pages/ErrorPage'
import { TradePage } from 'pages/tradePage/TradePage'
import { redirect, createBrowserRouter } from 'react-router-dom'
import { selectAllSymbolsRecord, selectExchangeInfoLoading, selectSymbolInfo } from './store/slices/exchangeInfo/exchangeInfoSlice'
import { fetchExchangeInfo } from './store/slices/exchangeInfo/exchangeInfoThunks'
import { store } from './store/store'


const SUPPORTED_LOCALES = ['en', 'uk', 'de']
const DEFAULT_LOCALE = 'en'

function getPreferredLocale(): string {
  return DEFAULT_LOCALE
}

export const tradeDefaultLoader = async ({ params }: { params: any }) => {
  let locale = params.locale

  if (!locale) {
    locale = getPreferredLocale()
  }

  if (!SUPPORTED_LOCALES.includes(locale)) {
    throw new Response(`Locale "${locale}" is not supported.`, {
      status: 404,
      statusText: 'Not Found',
    })
  }

  const state = store.getState()
  let allSymbolsRecord = selectAllSymbolsRecord(state)
  const isLoading = selectExchangeInfoLoading(state)

  if (!state.exchangeInfo.data && !isLoading) {
    try {
      const result = await store.dispatch(fetchExchangeInfo())
      if (fetchExchangeInfo.fulfilled.match(result)) {
        allSymbolsRecord = selectAllSymbolsRecord(store.getState())
      } else {
        console.error(
          'Failed to load exchange info for default trade route:',
          result.payload,
        )
        throw new Response(result.payload || 'Failed to load exchange info.', {
          status: 500,
          statusText: 'Internal Server Error',
        })
      }
    } catch (error) {
      console.error(
        'Error dispatching fetchExchangeInfo in tradeDefaultLoader:',
        error,
      )
      throw new Response('Failed to fetch exchange information.', {
        status: 500,
        statusText: 'Internal Server Error',
      })
    }
  }

  if (allSymbolsRecord && Object.keys(allSymbolsRecord).length > 0) {
    const firstSymbolKey = Object.keys(allSymbolsRecord)[0]
    const firstSymbolInfo = allSymbolsRecord[firstSymbolKey]
    const formattedSymbolForUrl = `${firstSymbolInfo.baseAsset}_${firstSymbolInfo.quoteAsset}`
    throw redirect(`/${locale}/trade/${formattedSymbolForUrl}`)
  } else {
    throw new Response(
      'No trading pairs available after loading exchange info.',
      { status: 404, statusText: 'Not Found' },
    )
  }
}

export const tradePageLoader = async ({
  params,
  request,
}: {
  params: any
  request: Request
}) => {
  let locale = params.locale 
  const urlSymbol: string = params.symbol

  if (!locale) {
    locale = getPreferredLocale()
    const currentUrl = new URL(request.url) 
    const newPath = `/${locale}${currentUrl.pathname}${currentUrl.search}`
    throw redirect(newPath) 
  }

  if (!SUPPORTED_LOCALES.includes(locale)) {
    throw new Response(`Locale "${locale}" is not supported.`, {
      status: 404,
      statusText: 'Not Found',
    })
  }

  if (!urlSymbol) {
    throw new Response('Trading pair symbol not provided in URL.', {
      status: 404,
      statusText: 'Not Found',
    })
  }

  const parts = urlSymbol.split('_')
  if (parts.length !== 2 || parts.some(p => !p)) {
    throw new Response(
      `Invalid symbol format "${urlSymbol}". Expected BASE_QUOTE (e.g., BTC_USDT).`,
      { status: 404, statusText: 'Not Found' },
    )
  }

  const baseAsset = parts[0].toUpperCase()
  const quoteAsset = parts[1].toUpperCase()
  const symbolKey = `${baseAsset}${quoteAsset}`
  const state = store.getState()
  let symbolInfo = selectSymbolInfo(state, symbolKey)
  const isLoading = selectExchangeInfoLoading(state)

  if (!state.exchangeInfo.data && !isLoading) {
    try {
      const result = await store.dispatch(fetchExchangeInfo())
      if (fetchExchangeInfo.fulfilled.match(result)) {
        symbolInfo = selectSymbolInfo(store.getState(), symbolKey)
      } else {
        console.error(
          'Failed to load exchange info for specific trade route:',
          result.payload,
        )
        throw new Response(result.payload || 'Failed to load exchange info.', {
          status: 500,
          statusText: 'Internal Server Error',
        })
      }
    } catch (error) {
      console.error('Error during fetchExchangeInfo in tradePageLoader:', error)
      throw new Response('Failed to fetch exchange information.', {
        status: 500,
        statusText: 'Internal Server Error',
      })
    }
  }

  if (!symbolInfo) {
    throw new Response(`Trading pair "${urlSymbol}" not found.`, {
      status: 404,
      statusText: 'Not Found',
    })
  }

  return {
    locale: locale,
    urlSymbol: urlSymbol,
    baseAsset: symbolInfo.baseAsset,
    quoteAsset: symbolInfo.quoteAsset,
    symbolKey: symbolKey,
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/:locale?/trade',
        loader: tradeDefaultLoader,
      },
      {
        path: '/:locale?/trade/:symbol',
        element: <TradePage />,
        loader: tradePageLoader,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
