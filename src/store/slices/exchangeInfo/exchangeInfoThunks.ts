import { createAsyncThunk } from '@reduxjs/toolkit'
import { ExchangeInfoResponse } from './types'
import axiosInstance from '../../../http/axios'

export const fetchExchangeInfo = createAsyncThunk<
  ExchangeInfoResponse,
  void,
  { rejectValue: string }
>('exchangeInfo/fetchExchangeInfo', async (_, { rejectWithValue }) => {
  try {
    const { data } =
      await axiosInstance.get<ExchangeInfoResponse>('/exchangeInfo')

    if (!data || !data.symbols || data.symbols.length === 0) {
      return rejectWithValue('No symbols found in exchange info response')
    }

    return data
  } catch (error: any) {
    const message =
      error.response?.data?.msg ||
      error.message ||
      'Unknown error while fetching exchange info'

    return rejectWithValue(message)
  }
})
