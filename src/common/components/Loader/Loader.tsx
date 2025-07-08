import  { FC } from 'react'
import styles from './Loader.module.css'

interface LoaderProps {
  color?: string
}

const Loader: FC<LoaderProps> = ({ color }) => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader} style={color ? { color: color } : {}}>
      </div>
    </div>
  )
}

export { Loader }
