import { FallbackProps } from 'react-error-boundary'
import { FC } from 'react'

interface ErrorFallbackProps extends FallbackProps {
  message?: string
}

const ErrorFallback: FC<ErrorFallbackProps> = ({
  resetErrorBoundary,
  message = 'Something went wrong',
}) => {
  const handleReloadComponent = () => {
    resetErrorBoundary()
  }

  const handleRefreshPage = () => {
    window.location.reload()
  }

  return (
    <div
      className="flex flex-col justify-center items-center m-auto rounded-lg text-gray-700 font-sans min-h-[50px] text-center"
      role="alert"
    >
      <p className="text-sm font-medium text-gray-700">{message}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={handleReloadComponent}
          className="bg-none border-none p-0 cursor-pointer text-sm font-bold no-underline transition-opacity duration-200 ease-in-out text-yellow-500 hover:opacity-80"
        >
          Reload it
        </button>
        <span className="text-gray-700 text-sm"> or </span>
        <button
          onClick={handleRefreshPage}
          className="bg-none border-none p-0 cursor-pointer text-sm font-bold no-underline transition-opacity duration-200 ease-in-out text-yellow-500 hover:opacity-80"
        >
          Refresh the page
        </button>
      </div>
      {/*
      // {process.env.NODE_ENV === 'development' && (
      //   <details className="mt-6 text-left bg-gray-100 p-2 rounded max-w-full overflow-x-auto text-sm text-gray-800 whitespace-pre-wrap break-words">
      //     <summary className="font-bold cursor-pointer text-gray-700">Error Details</summary>
      //     <pre>{error.message}</pre>
      //     <pre>{error.stack}</pre>
      //   </details>
      // )}
      */}
    </div>
  )
}

export { ErrorFallback }
