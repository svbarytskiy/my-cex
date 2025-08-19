import { ErrorInfo } from 'react'

interface LogErrorOptions {
  message?: string
  details?: string
  context?: Record<string, any>
}

function logError(
  error: unknown,
  info?: ErrorInfo,
  options?: LogErrorOptions,
): void {
  let errorMessage: string
  let errorDetails: string | null | undefined = undefined

  if (error instanceof Error) {
    errorMessage = options?.message || error.message
    errorDetails = error.stack || (info ? info.componentStack : undefined)
  } else if (typeof error === 'string') {
    errorMessage = options?.message || error
    errorDetails = options?.details
  } else {
    try {
      errorMessage =
        options?.message || `Non-Error object thrown: ${JSON.stringify(error)}`
      errorDetails = options?.details
    } catch {
      errorMessage =
        options?.message || 'An unstringifiable non-Error object was thrown.'
    }
  }

  console.groupCollapsed('APP ERROR:')
  console.error('Message:', errorMessage)
  console.error('Error Object:', error)
  if (errorDetails) {
    console.error('Details/Stack:', errorDetails)
  }
  if (info) {
    console.error(
      'React Component Stack (from ErrorBoundary):',
      info.componentStack,
    )
  }
  if (options?.context) {
    console.error('Context:', options.context)
  }
  console.groupEnd()

  // if (process.env.NODE_ENV === 'production' && typeof Sentry !== 'undefined') {
  //   Sentry.captureException(error, {
  //     extra: {
  //       info,
  //       optionsContext: options?.context,
  //     },
  //     tags: {
  //       location: info ? 'react_boundary' : 'manual_catch',
  //     }
  //   });
  // }
}

export { logError }
