import { createSlice, PayloadAction, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface RouteSelectionPayload {
  fromStation: string;
  toStation: string;
  viaStation: string | undefined;
  departureDate: string;
  departureTime: string | undefined;
}

export interface Passenger {
  discount?: string;
  seatNumber?: string;
  carNumber?: string;
}

export interface TicketData {
  route: RouteSelectionPayload;
  passengerCount: number;
  returnType: 'one-way' | 'round-trip-open' | 'round-trip-fixed';
  returnDate?: string;
  passengers: Passenger[];
  ticketType: 'standard' | 'credit' | 'family' | 'regional' | 'small-group' | 'reservation';
}

interface TicketState {
  currentTicket: {
    route: RouteSelectionPayload | null;
    passengerCount: number;
    returnType: 'one-way' | 'round-trip-open' | 'round-trip-fixed';
    returnDate: string | null;
    passengers: Passenger[];
  } | null;
  issuedTickets: any[];
}

const initialState: TicketState = {
  currentTicket: null,
  issuedTickets: [],
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    startNewTicket: (state) => {
      state.currentTicket = {
        route: null,
        passengerCount: 1,
        returnType: 'one-way',
        returnDate: null,
        passengers: [{ discount: 'Без намаление', seatNumber: '' }],
      };
      console.log("Started new ticket with state:", state.currentTicket); // Debug
    },
    setRouteSelection: (state, action: PayloadAction<RouteSelectionPayload>) => {
      if (state.currentTicket) {
        state.currentTicket.route = action.payload;
      } else {
        console.error("Cannot set route: No current ticket process started.");
      }
    },
    setPassengerCount: (state, action: PayloadAction<number>) => {
      if (state.currentTicket) {
        const newCount = Math.max(1, action.payload);
        const currentCount = state.currentTicket.passengers.length;
        state.currentTicket.passengerCount = newCount;

        console.log(`Setting passenger count to ${newCount} (was ${currentCount})`);

        if (newCount > currentCount) {
          for (let i = currentCount; i < newCount; i++) {
            state.currentTicket.passengers.push({ discount: 'Без намаление', seatNumber: '' });
          }
        } else if (newCount < currentCount) {
          state.currentTicket.passengers.splice(newCount);
        }
      } else {
        console.error("Cannot set passenger count: No current ticket process started.");
      }
    },
    setReturnType: (state, action: PayloadAction<'one-way' | 'round-trip-open' | 'round-trip-fixed'>) => {
      if (state.currentTicket) {
        console.log(`Setting return type to ${action.payload} (was ${state.currentTicket.returnType})`);
        state.currentTicket.returnType = action.payload;
        if (action.payload !== 'round-trip-fixed') {
          state.currentTicket.returnDate = null;
        }
      } else {
        console.error("Cannot set return type: No current ticket process started.");
      }
    },
    setReturnDate: (state, action: PayloadAction<string | null>) => {
      if (state.currentTicket && state.currentTicket.returnType === 'round-trip-fixed') {
        state.currentTicket.returnDate = action.payload;
      }
    },
    updatePassenger: (state, action: PayloadAction<{ index: number; data: Partial<Passenger> }>) => {
      if (state.currentTicket && state.currentTicket.passengers[action.payload.index]) {
        state.currentTicket.passengers[action.payload.index] = {
          ...state.currentTicket.passengers[action.payload.index],
          ...action.payload.data,
        };
      }
    },
    issueTicket: (state) => {
      if (state.currentTicket) {
        console.log('Issuing ticket:', JSON.stringify(state.currentTicket, null, 2));
        state.issuedTickets.push({ ...state.currentTicket, issuedAt: new Date().toISOString() });
        state.currentTicket = null;
      }
    },
    cancelTicketProcess: (state) => {
      state.currentTicket = null;
    },
  },
});

// Extract the action creators
const { actions } = ticketSlice;

// Type-assert the action creators to ensure they have the proper return types
export const startNewTicket = actions.startNewTicket;
export const setRouteSelection = actions.setRouteSelection as ActionCreatorWithPayload<RouteSelectionPayload>;
export const setPassengerCount = actions.setPassengerCount as ActionCreatorWithPayload<number>;
export const setReturnType = actions.setReturnType as ActionCreatorWithPayload<'one-way' | 'round-trip-open' | 'round-trip-fixed'>;
export const setReturnDate = actions.setReturnDate as ActionCreatorWithPayload<string | null>;
export const updatePassenger = actions.updatePassenger as ActionCreatorWithPayload<{ index: number; data: Partial<Passenger> }>;
export const issueTicket = actions.issueTicket;
export const cancelTicketProcess = actions.cancelTicketProcess;

export const selectCurrentTicket = (state: RootState) => state.ticket.currentTicket;
export const selectIssuedTickets = (state: RootState) => state.ticket.issuedTickets;

export default ticketSlice.reducer; 