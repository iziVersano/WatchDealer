import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { Watch, WatchFilters, WatchFormData } from '../types';
import { apiRequest } from '../lib/queryClient';

// Define initial filters state
const initialFilters: WatchFilters = {
  brand: [],
  size: [],
  material: [],
  priceRange: null
};

// Initial state
const initialState = {
  watches: [] as Watch[],
  filteredWatches: [] as Watch[],
  favorites: [] as Watch[],
  filters: initialFilters,
  isLoading: false,
  error: null as string | null
};

// Async thunks
export const fetchWatches = createAsyncThunk(
  'watches/fetchWatches',
  async (filters: Partial<WatchFilters> | undefined, { rejectWithValue }) => {
    try {
      // Build query string from filters
      let queryParams = '';
      
      if (filters) {
        const params = new URLSearchParams();
        
        if (filters.brand && filters.brand.length > 0) {
          filters.brand.forEach(brand => params.append('brand', brand));
        }
        
        if (filters.size && filters.size.length > 0) {
          filters.size.forEach(size => params.append('size', size.toString()));
        }
        
        if (filters.material && filters.material.length > 0) {
          filters.material.forEach(material => params.append('material', material));
        }
        
        if (filters.priceRange) {
          params.append('priceMin', filters.priceRange[0].toString());
          params.append('priceMax', filters.priceRange[1].toString());
        }
        
        queryParams = params.toString();
      }
      
      const url = `/api/watches${queryParams ? `?${queryParams}` : ''}`;
      const response = await apiRequest('GET', url);
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch watches');
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  'watches/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('GET', '/api/favorites');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch favorites');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'watches/addFavorite',
  async (watchId: number, { rejectWithValue }) => {
    try {
      await apiRequest('POST', '/api/favorites', { watchId });
      return watchId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add favorite');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'watches/removeFavorite',
  async (watchId: number, { rejectWithValue }) => {
    try {
      await apiRequest('DELETE', `/api/favorites/${watchId}`);
      return watchId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove favorite');
    }
  }
);

export const createWatch = createAsyncThunk(
  'watches/createWatch',
  async (watchData: WatchFormData, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/watches', watchData);
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create watch');
    }
  }
);

export const updateWatch = createAsyncThunk(
  'watches/updateWatch',
  async ({ id, data }: { id: number, data: Partial<WatchFormData> }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('PUT', `/api/watches/${id}`, data);
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update watch');
    }
  }
);

export const deleteWatch = createAsyncThunk(
  'watches/deleteWatch',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiRequest('DELETE', `/api/watches/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete watch');
    }
  }
);

// Slice
const watchSlice = createSlice({
  name: 'watches',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<WatchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialFilters;
      state.filteredWatches = state.watches;
    },
    addBrandFilter: (state, action: PayloadAction<string>) => {
      if (!state.filters.brand.includes(action.payload)) {
        state.filters.brand.push(action.payload);
      }
    },
    removeBrandFilter: (state, action: PayloadAction<string>) => {
      state.filters.brand = state.filters.brand.filter(brand => brand !== action.payload);
    },
    addSizeFilter: (state, action: PayloadAction<number>) => {
      if (!state.filters.size.includes(action.payload)) {
        state.filters.size.push(action.payload);
      }
    },
    removeSizeFilter: (state, action: PayloadAction<number>) => {
      state.filters.size = state.filters.size.filter(size => size !== action.payload);
    },
    addMaterialFilter: (state, action: PayloadAction<string>) => {
      if (!state.filters.material.includes(action.payload)) {
        state.filters.material.push(action.payload);
      }
    },
    removeMaterialFilter: (state, action: PayloadAction<string>) => {
      state.filters.material = state.filters.material.filter(material => material !== action.payload);
    },
    setPriceRange: (state, action: PayloadAction<[number, number] | null>) => {
      state.filters.priceRange = action.payload;
    },
    applyFilters: (state) => {
      let filtered = [...state.watches];
      
      // Apply brand filter
      if (state.filters.brand.length > 0) {
        filtered = filtered.filter(watch => state.filters.brand.includes(watch.brand));
      }
      
      // Apply size filter
      if (state.filters.size.length > 0) {
        filtered = filtered.filter(watch => state.filters.size.includes(watch.size));
      }
      
      // Apply material filter
      if (state.filters.material.length > 0) {
        filtered = filtered.filter(watch => state.filters.material.includes(watch.material));
      }
      
      // Apply price range filter
      if (state.filters.priceRange) {
        const [min, max] = state.filters.priceRange;
        filtered = filtered.filter(watch => watch.price >= min && watch.price <= max);
      }
      
      state.filteredWatches = filtered;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Watches
      .addCase(fetchWatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.watches = action.payload;
        state.filteredWatches = action.payload;
      })
      .addCase(fetchWatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Add Favorite
      .addCase(addFavorite.fulfilled, (state, action) => {
        const watchId = action.payload;
        const watch = state.watches.find(w => w.id === watchId);
        if (watch && !state.favorites.some(f => f.id === watchId)) {
          state.favorites.push(watch);
        }
      })
      
      // Remove Favorite
      .addCase(removeFavorite.fulfilled, (state, action) => {
        const watchId = action.payload;
        state.favorites = state.favorites.filter(watch => watch.id !== watchId);
      })
      
      // Create Watch
      .addCase(createWatch.fulfilled, (state, action) => {
        state.watches.push(action.payload);
        state.filteredWatches = state.watches;
      })
      
      // Update Watch
      .addCase(updateWatch.fulfilled, (state, action) => {
        const updatedWatch = action.payload;
        state.watches = state.watches.map(watch => 
          watch.id === updatedWatch.id ? updatedWatch : watch
        );
        state.filteredWatches = state.filteredWatches.map(watch => 
          watch.id === updatedWatch.id ? updatedWatch : watch
        );
        state.favorites = state.favorites.map(watch => 
          watch.id === updatedWatch.id ? updatedWatch : watch
        );
      })
      
      // Delete Watch
      .addCase(deleteWatch.fulfilled, (state, action) => {
        const id = action.payload;
        state.watches = state.watches.filter(watch => watch.id !== id);
        state.filteredWatches = state.filteredWatches.filter(watch => watch.id !== id);
        state.favorites = state.favorites.filter(watch => watch.id !== id);
      });
  }
});

// Actions
export const { 
  setFilters, 
  clearFilters, 
  addBrandFilter, 
  removeBrandFilter, 
  addSizeFilter, 
  removeSizeFilter, 
  addMaterialFilter, 
  removeMaterialFilter, 
  setPriceRange,
  applyFilters
} = watchSlice.actions;

// Selectors
export const selectWatches = (state: RootState) => state.watches.watches;
export const selectFilteredWatches = (state: RootState) => state.watches.filteredWatches;
export const selectFavorites = (state: RootState) => state.watches.favorites;
export const selectFilters = (state: RootState) => state.watches.filters;
export const selectIsWatchesFavorite = (watchId: number) => (state: RootState) => 
  state.watches.favorites.some(watch => watch.id === watchId);

// Reducer
export default watchSlice.reducer;
