import { createSlice } from '@reduxjs/toolkit';
import { signIn, signUp } from './authService';
import type { AuthState } from '@/types/auth.types';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle signIn
    builder.addCase(signIn.pending, (state) => {
      state.status = 'loading';
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      const { user, access_token } = action.payload;
      state.status = 'succeeded';
      state.isLoading = false;
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;
      localStorage.setItem('token', access_token);
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.status = 'failed';
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Handle signUp
    builder.addCase(signUp.pending, (state) => {
      state.status = 'loading';
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      const { user, access_token } = action.payload;
      state.status = 'succeeded';
      state.isLoading = false;
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;
      localStorage.setItem('token', access_token);
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.status = 'failed';
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
