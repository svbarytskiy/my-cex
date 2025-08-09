import { useAppSelector, RootState } from 'app/store/store'
import {
  selectDepthLoading,
  selectDepthError,
  selectWsConnectionStatus,
} from '../../../app/store/slices/depth/depthSlice'
import { selectOrderBookData } from 'app/store/slices/depth/depthSelectors'

export const useOrderBookState = () => {
  const loading = useAppSelector(selectDepthLoading)
  const error = useAppSelector(selectDepthError)
  const wsConnected = useAppSelector(selectWsConnectionStatus)
  const { bids: rawBids, asks: rawAsks } = useAppSelector(selectOrderBookData)
  const price = useAppSelector((state: RootState) => state.ticker.price)

  return {
    loading,
    error,
    wsConnected,
    rawBids,
    rawAsks,
    price,
  }
}
