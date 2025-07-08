import { FallbackProps } from 'react-error-boundary'
import React from 'react'
import styles from './ErrorFallback.module.css'
import { AlertTriangle } from 'lucide-react'

interface ErrorFallbackProps extends FallbackProps {
  message?: string
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
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
    <div className={styles.errorContainer} role="alert">
      <AlertTriangle
        size={70} 
        color="#f0b90b" 
        className={styles.alertIcon}
      />
      <p className={styles.errorMessage}>{message}</p>
      <div className={styles.actions}>
        <button
          onClick={handleReloadComponent}
          className={`${styles.actionButton} ${styles.reloadButton}`}
        >
          Reload it
        </button>
        <span className={styles.separator}> or </span>
        <button
          onClick={handleRefreshPage}
          className={`${styles.actionButton} ${styles.refreshButton}`}
        >
          Refresh the page
        </button>
      </div>

      {/* {process.env.NODE_ENV === 'development' && ( */}
      {/* <details className={styles.errorDetails}>
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </details> */}
      {/* )} */}
    </div>
  )
}

export { ErrorFallback }
