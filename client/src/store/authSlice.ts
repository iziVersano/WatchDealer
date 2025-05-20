import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { AuthState, LoginCredentials, GoogleLoginCredentials, User } from '../types';
import { apiRequest } from '../lib/queryClient';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to login');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/auth/register', credentials);
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to register');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      // Import auth functions dynamically to avoid circular dependencies
      const { auth, googleProvider } = await import('@/lib/firebase');
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get the Google ID token and user info
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = result.user.uid || credential?.accessToken; // Use UID as preferred token
      const email = result.user.email;
      
      if (!token || !email) {
        return rejectWithValue('Google authentication failed: Missing user information');
      }
      
      // Send the token to our backend to create/authenticate the user
      const response = await apiRequest('POST', '/api/auth/google', {
        token,
        email
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(`Server error: ${errorData.message || 'Unknown error'}`);
      }
      
      return await response.json();
    } catch (error: any) {
      // Handle Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        return rejectWithValue('Google sign-in was cancelled');
      }
      if (error.code === 'auth/popup-blocked') {
        return rejectWithValue('Pop-up was blocked by your browser. Please allow pop-ups for this site.');
      }
      console.error('Google login error:', error);
      return rejectWithValue(error.message || 'Failed to login with Google');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('GET', '/api/auth/me');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get current user');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiRequest('POST', '/api/auth/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to logout');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Actions
export const { clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === 'admin';

// Reducer
export default authSlice.reducer;
