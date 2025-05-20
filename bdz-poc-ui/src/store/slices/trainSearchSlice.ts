import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TrainSearchState, TrainSearchParams, Train, TrainStop } from '../../types/train';
import { mockTrains } from '../../mocks/trains';

const initialState: TrainSearchState = {
  searchParams: null,
  trains: [],
  selectedTrain: null,
  loading: false,
  error: null,
};

// Async thunk for fetching trains
export const fetchTrains = createAsyncThunk(
  'trainSearch/fetchTrains',
  async (params: TrainSearchParams, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data based on search params
      const filteredTrains = mockTrains.filter((train: Train) => {
        const trainDate = new Date(train.departureTime);
        const searchDate = new Date(params.date);
        
        // Check if train is on the selected date
        if (trainDate.toDateString() !== searchDate.toDateString()) {
          return false;
        }

        // Check if train matches the time range
        const trainHour = trainDate.getHours();
        if (params.timeRange !== 'all') {
          const timeRanges: Record<string, [number, number]> = {
            morning: [6, 12],
            afternoon: [12, 18],
            evening: [18, 24],
            night: [0, 6],
          };
          
          const timeRange = timeRanges[params.timeRange];
          if (!timeRange) {
            return false;
          }
          
          const [start, end] = timeRange;
          if (trainHour < start || trainHour >= end) {
            return false;
          }
        }

        // Check if train matches the route
        const hasFromStop = train.stops.some((stop: TrainStop) => stop.station === params.from);
        const hasToStop = train.stops.some((stop: TrainStop) => stop.station === params.to);
        if (!hasFromStop || !hasToStop) {
          return false;
        }

        // Check if the route is valid (from comes before to)
        const fromIndex = train.stops.findIndex((stop: TrainStop) => stop.station === params.from);
        const toIndex = train.stops.findIndex((stop: TrainStop) => stop.station === params.to);
        if (fromIndex >= toIndex) {
          return false;
        }

        return true;
      });

      return filteredTrains;
    } catch (error) {
      return rejectWithValue('Failed to fetch trains');
    }
  }
);

const trainSearchSlice = createSlice({
  name: 'trainSearch',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<TrainSearchParams>) => {
      state.searchParams = action.payload;
    },
    selectTrain: (state, action: PayloadAction<Train>) => {
      state.selectedTrain = action.payload;
    },
    clearSearch: (state) => {
      state.searchParams = null;
      state.trains = [];
      state.selectedTrain = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrains.fulfilled, (state, action) => {
        state.loading = false;
        state.trains = action.payload;
      })
      .addCase(fetchTrains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchParams, selectTrain, clearSearch } = trainSearchSlice.actions;
export default trainSearchSlice.reducer; 