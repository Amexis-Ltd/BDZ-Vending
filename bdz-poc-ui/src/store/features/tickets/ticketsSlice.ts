import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TicketType = 'oneWay' | 'return' | 'season' | 'group';

export interface Station {
  id: string;
  name: string;
  nameEn: string;
  code: string;
}

export const popularStations: Station[] = [
  { id: 'SF', name: 'София', nameEn: 'Sofia', code: 'SF' },
  { id: 'PD', name: 'Пловдив', nameEn: 'Plovdiv', code: 'PD' },
  { id: 'VR', name: 'Варна', nameEn: 'Varna', code: 'VR' },
  { id: 'BG', name: 'Бургас', nameEn: 'Burgas', code: 'BG' },
  { id: 'RS', name: 'Русе', nameEn: 'Ruse', code: 'RS' },
  { id: 'SZ', name: 'Стара Загора', nameEn: 'Stara Zagora', code: 'SZ' },
  { id: 'PL', name: 'Плевен', nameEn: 'Pleven', code: 'PL' },
  { id: 'BL', name: 'Благоевград', nameEn: 'Blagoevgrad', code: 'BL' },
  { id: 'VT', name: 'Велико Търново', nameEn: 'Veliko Tarnovo', code: 'VT' },
  { id: 'SL', name: 'Сливен', nameEn: 'Sliven', code: 'SL' },
  { id: 'SH', name: 'Шумен', nameEn: 'Shumen', code: 'SH' },
  { id: 'DV', name: 'Добрич', nameEn: 'Dobrich', code: 'DV' },
  { id: 'VR', name: 'Враца', nameEn: 'Vratsa', code: 'VR' },
  { id: 'GR', name: 'Габрово', nameEn: 'Gabrovo', code: 'GR' },
  { id: 'KR', name: 'Кърджали', nameEn: 'Kardzhali', code: 'KR' },
  { id: 'YM', name: 'Ямбол', nameEn: 'Yambol', code: 'YM' },
  { id: 'HS', name: 'Хасково', nameEn: 'Haskovo', code: 'HS' },
  { id: 'PV', name: 'Перник', nameEn: 'Pernik', code: 'PV' },
  { id: 'KY', name: 'Кюстендил', nameEn: 'Kyustendil', code: 'KY' }
];

export interface Filters {
  fastTrainsOnly: boolean;
  directTrainsOnly: boolean;
  sleepingCarsOnly: boolean;
  firstClassOnly: boolean;
  accessibleCarsOnly: boolean;
}

export interface Train {
  id: string;
  number: string;
  type: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  transfers: number;
  delay: number;
  price: number;
  features: string[];
  route: Array<{
    station: string;
    arrival: string | null;
    departure: string | null;
    platform: string;
  }>;
}

export interface TicketState {
  currentStep: number;
  totalSteps: number;
  ticketType: TicketType | null;
  originStation: Station | null;
  destinationStation: Station | null;
  useCurrentLocation: boolean;
  travelDate: string | null;
  timeRange: 'all' | 'morning' | 'afternoon' | 'evening' | 'night';
  filters: Filters;
  selectedTrain: Train | null;
}

const initialState: TicketState = {
  currentStep: 1,
  totalSteps: 6,
  ticketType: null,
  originStation: null,
  destinationStation: null,
  useCurrentLocation: false,
  travelDate: null,
  timeRange: 'all',
  filters: {
    fastTrainsOnly: false,
    directTrainsOnly: false,
    sleepingCarsOnly: false,
    firstClassOnly: false,
    accessibleCarsOnly: false
  },
  selectedTrain: null
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTicketType: (state, action: PayloadAction<TicketType>) => {
      state.ticketType = action.payload;
    },
    setOriginStation: (state, action: PayloadAction<Station | null>) => {
      state.originStation = action.payload;
    },
    setDestinationStation: (state, action: PayloadAction<Station | null>) => {
      state.destinationStation = action.payload;
    },
    setUseCurrentLocation: (state, action: PayloadAction<boolean>) => {
      state.useCurrentLocation = action.payload;
    },
    swapStations: (state) => {
      const temp = state.originStation;
      state.originStation = state.destinationStation;
      state.destinationStation = temp;
    },
    resetTicketSelection: (state) => {
      state.ticketType = null;
      state.currentStep = 1;
      state.originStation = null;
      state.destinationStation = null;
      state.useCurrentLocation = false;
      state.travelDate = null;
      state.timeRange = 'all';
      state.filters = initialState.filters;
      state.selectedTrain = null;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setTravelDate: (state, action: PayloadAction<string | null>) => {
      state.travelDate = action.payload;
    },
    setTimeRange: (state, action: PayloadAction<'morning' | 'afternoon' | 'evening' | 'night' | 'all'>) => {
      state.timeRange = action.payload;
    },
    setFilters: (state, action: PayloadAction<TicketState['filters']>) => {
      state.filters = action.payload;
    },
    setSelectedTrain: (state, action: PayloadAction<Train | null>) => {
      state.selectedTrain = action.payload;
    },
  },
});

export const {
  setTicketType,
  setOriginStation,
  setDestinationStation,
  setUseCurrentLocation,
  swapStations,
  resetTicketSelection,
  setCurrentStep,
  setTravelDate,
  setTimeRange,
  setFilters,
  setSelectedTrain,
} = ticketsSlice.actions;

export default ticketsSlice.reducer; 