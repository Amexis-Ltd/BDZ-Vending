import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface BanknoteCount {
  denomination: number;
  count: number;
}

interface ShiftData {
  id: string;
  startTime: string;
  endTime: string | undefined;
  initialDeposit: number;
  initialCards: number | undefined;
  finalBanknotes: BanknoteCount[] | undefined;
  remainingCards: number | undefined;
  totalAmount: number | undefined;
  currentBanknotes: BanknoteCount[] | undefined;
}

interface ShiftState {
  isShiftActive: boolean;
  currentShift: ShiftData | undefined;
  shiftHistory: ShiftData[];
}

const initialState: ShiftState = {
  isShiftActive: false,
  currentShift: undefined,
  shiftHistory: [],
};

export const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    startShift: (state, action: PayloadAction<{ deposit: number; cards?: number }>) => {
      const newShift: ShiftData = {
        id: new Date().getTime().toString(),
        startTime: new Date().toISOString(),
        endTime: undefined,
        initialDeposit: action.payload.deposit,
        initialCards: action.payload.cards,
        finalBanknotes: undefined,
        remainingCards: undefined,
        totalAmount: undefined,
        currentBanknotes: [],
      };
      
      state.isShiftActive = true;
      state.currentShift = newShift;
    },
    endShift: (state, action: PayloadAction<{
      banknotes: BanknoteCount[];
      remainingCards?: number;
    }>) => {
      if (!state.currentShift) return;

      const totalAmount = action.payload.banknotes.reduce(
        (sum, note) => sum + (note.denomination * note.count), 
        0
      );

      const completedShift: ShiftData = {
        ...state.currentShift,
        endTime: new Date().toISOString(),
        finalBanknotes: action.payload.banknotes,
        remainingCards: action.payload.remainingCards,
        totalAmount,
      };

      state.shiftHistory.unshift(completedShift);
      state.isShiftActive = false;
      state.currentShift = undefined;
    },
    addBanknote: (state, action: PayloadAction<{ denomination: number; count: number }>) => {
      if (!state.currentShift) return;

      const { denomination, count } = action.payload;
      const currentBanknotes = state.currentShift.currentBanknotes ?? [];
      const existingNoteIndex = currentBanknotes.findIndex(
        note => note.denomination === denomination
      );

      if (existingNoteIndex >= 0) {
        const existingNote = currentBanknotes[existingNoteIndex] as BanknoteCount;
        existingNote.count += count;
      } else {
        currentBanknotes.push({ denomination, count });
      }

      if (state.currentShift) {
        state.currentShift.currentBanknotes = currentBanknotes;
      }
    },
    removeBanknote: (state, action: PayloadAction<{ denomination: number; count: number }>) => {
      if (!state.currentShift) return;

      const { denomination, count } = action.payload;
      const currentBanknotes = state.currentShift.currentBanknotes ?? [];
      const existingNoteIndex = currentBanknotes.findIndex(
        note => note.denomination === denomination
      );

      if (existingNoteIndex >= 0) {
        const existingNote = currentBanknotes[existingNoteIndex] as BanknoteCount;
        const newCount = existingNote.count - count;
        if (newCount <= 0) {
          currentBanknotes.splice(existingNoteIndex, 1);
        } else {
          existingNote.count = newCount;
        }
        if (state.currentShift) {
          state.currentShift.currentBanknotes = currentBanknotes;
        }
      }
    },
  },
});

export const { startShift, endShift, addBanknote, removeBanknote } = shiftSlice.actions;

export const selectShiftStatus = (state: RootState) => state.shift.isShiftActive;
export const selectCurrentShift = (state: RootState) => state.shift.currentShift;
export const selectShiftHistory = (state: RootState) => state.shift.shiftHistory;

export default shiftSlice.reducer; 