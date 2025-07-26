import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { logout } from '@/services/auth/authSlice';
import type { AppDispatch } from '@/store/store';
import type { User, SignUpData, SignInData } from '@/types/auth.types';

const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const signUp = createAsyncThunk<
  { user: User; access_token: string },
  SignUpData,
  { rejectValue: string }
>('auth/signUp', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, userData);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Sign up failed';
    return rejectWithValue(errorMessage);
  }
});

export const signIn = createAsyncThunk<
  { user: User; access_token: string },
  SignInData,
  { rejectValue: string }
>('auth/signIn', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/signin`, credentials);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Sign in failed';
    return rejectWithValue(errorMessage);
  }
});

export const LogOut = () => async (dispatch: AppDispatch) => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      dispatch(logout());
    }
  } catch (error: any) {
    console.error('Logout failed:', error.response?.data?.message || error.message);
    // Even if the API call fails, we should still log the user out locally
    dispatch(logout());
    throw error;
  }
};
