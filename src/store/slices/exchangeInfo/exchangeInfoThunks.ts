import { createAsyncThunk } from '@reduxjs/toolkit';
import { ExchangeInfoResponse } from './types';
import axiosInstance from '../../../http/axios';

export const fetchExchangeInfo = createAsyncThunk<
    ExchangeInfoResponse,
    string,
    { rejectValue: string }
>(
    'exchangeInfo/fetchExchangeInfo',
    async (symbol, { rejectWithValue }) => {
        try {
            const currentSymbol = symbol.toUpperCase();

            const { data } = await axiosInstance.get('/exchangeInfo', {
                params: { symbol: currentSymbol },
            });

            if (!data?.symbols?.length) {
                return rejectWithValue('Symbol not found in response');
            }

            return data.symbols[0] as ExchangeInfoResponse;
        } catch (error: any) {
            const message =
                error.response?.data?.msg ||
                error.message ||
                'Unknown error while fetching exchange info';

            return rejectWithValue(message);
        }
    }
);