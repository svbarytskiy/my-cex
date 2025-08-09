import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'

export const ErrorPage = () => {
  const error = useRouteError()
  let status: number = 404
  let statusText: string = 'Not Found'
  let message: string = 'На жаль, таку сторінку не знайдено.'
  let detailMessage: string | null = null

  if (isRouteErrorResponse(error)) {
    status = error.status
    statusText = error.statusText
    if (typeof error.data === 'string') {
      detailMessage = error.data
    } else if (error.data && typeof error.data.message === 'string') {
      detailMessage = error.data.message
    }
    message = detailMessage || error.statusText || message
  } else if (error instanceof Error) {
    status = 500
    statusText = 'Internal Error'
    message = 'Сталася неочікувана помилка.'
    detailMessage = error.message
  } else {
    status = 500
    statusText = 'Unknown Error'
    message = 'Сталася невідома помилка.'
  }
  if (isRouteErrorResponse(error)) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-5 box-border"
        style={{
          backgroundColor: 'var(--background-primary)',
          color: 'var(--text-primary)',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        <h1 className="text-5xl font-bold mb-4">
          Помилка {status}
          {statusText && ` - ${statusText}`}
        </h1>
        <p className="text-xl max-w-2xl text-center leading-relaxed">
          {message}
        </p>
        {detailMessage && detailMessage !== message && (
          <p
            className="text-lg text-gray-400 mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Деталі: **{detailMessage}**
          </p>
        )}
        <Link
          to="/"
          className="mt-8 px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-300"
          style={{
            backgroundColor: 'var(--button-primary-background)',
            color: 'var(--button-primary-text)',
          }}
        >
          Повернутися на головну
        </Link>
      </div>
    )
  }

  throw error
}
