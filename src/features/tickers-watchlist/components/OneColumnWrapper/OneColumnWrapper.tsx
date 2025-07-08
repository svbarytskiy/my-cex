import { ReactNode, FC } from 'react'
import styles from './OneColumnWrapper.module.css'

interface OneColumnWrapperProps {
  children: ReactNode
}

const OneColumnWrapper: FC<OneColumnWrapperProps> = ({ children }) => {
  return <div className={styles.columnHeader}>{children}</div>
}

export { OneColumnWrapper }
