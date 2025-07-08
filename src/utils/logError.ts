// src/utils/logError.ts

import { ErrorInfo } from 'react' // Тип ErrorInfo для інформації від React Error Boundary

/**
 * Опції для логування помилки.
 * Залишені для майбутньої розширюваності, але наразі використовуються лише для `context`.
 */
interface LogErrorOptions {
  message?: string // Може бути використано для кастомного повідомлення в консолі
  details?: string // Додаткові деталі або стек помилки
  // type?: 'error' | 'warning' | 'info'; // Не використовується наразі
  // autoHide?: boolean; // Не використовується наразі
  context?: Record<string, any> // Додаткові метадані
}

/**
 * Функція для логування помилок у консоль.
 * Призначена для використання під час розробки для швидкого виявлення проблем.
 *
 * @param error Об'єкт помилки (може бути Error, рядок, або будь-що, що кидається).
 * @param info Додаткова інформація від React Error Boundary (необов'язково).
 * @param options Додаткові опції для логування.
 */
function logError(
  error: unknown, // `unknown` дозволяє приймати будь-який тип помилки
  info?: ErrorInfo, // info є необов'язковим, бо не всі помилки походять від ErrorBoundary
  options?: LogErrorOptions,
): void {
  // Визначаємо основне повідомлення про помилку
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

  // ----- Місце для майбутньої інтеграції з сервісами моніторингу помилок -----
  // У продакшн-середовищі тут можна було б відправляти помилки до Sentry, Datadog тощо.
  // Приклад для Sentry:
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
