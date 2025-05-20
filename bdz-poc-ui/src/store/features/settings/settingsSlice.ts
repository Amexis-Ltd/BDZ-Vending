import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'bg' | 'en';
export type ThemeMode = 'light' | 'dark' | 'high-contrast';

interface SettingsState {
  language: Language;
  themeMode: ThemeMode;
  fontSize: number;
  isHighContrast: boolean;
  isOfflineMode: boolean;
}

const initialState: SettingsState = {
  language: 'bg',
  themeMode: 'light',
  fontSize: 16,
  isHighContrast: false,
  isOfflineMode: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      state.isHighContrast = action.payload === 'high-contrast';
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = Math.max(12, Math.min(24, action.payload));
    },
    toggleHighContrast: (state) => {
      state.isHighContrast = !state.isHighContrast;
      state.themeMode = state.isHighContrast ? 'high-contrast' : 'light';
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.isOfflineMode = action.payload;
    },
  },
});

export const {
  setLanguage,
  setThemeMode,
  setFontSize,
  toggleHighContrast,
  setOfflineMode,
} = settingsSlice.actions;

export default settingsSlice.reducer; 