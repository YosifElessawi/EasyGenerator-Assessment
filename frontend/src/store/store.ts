import { configureStore, isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import authReducer from '@/services/auth';
import type { AuthState } from '@/types/auth.types';

// Define the root state type
export interface RootState {
  auth: AuthState;
}

// Create the logger middleware
const logger = createLogger({
  collapsed: true,
  duration: true,
  timestamp: true,
  // Only log in development
  predicate: () => process.env.NODE_ENV !== 'production',
  // Custom state transformer to show only relevant parts of the state
  stateTransformer: (state: RootState) => ({
    auth: {
      isAuthenticated: state.auth.isAuthenticated,
      token: state.auth.token ? state.auth.token : null,
      user: state.auth.user,
      status: state.auth.status,
      error: state.auth.error,
    },
  }),
});

// Custom middleware to log rejected actions
const errorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.error('Action was rejected:', action);
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(logger)
      .concat(errorLogger),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export the types
export type AppDispatch = typeof store.dispatch;
