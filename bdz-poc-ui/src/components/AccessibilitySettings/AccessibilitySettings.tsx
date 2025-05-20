import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Slider,
  FormControlLabel,
  Divider,
  useTheme,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { RootState } from '../../store/store';
import {
  setFontSize,
  toggleHighContrast,
  setThemeMode,
  ThemeMode,
} from '../../store/features/settings/settingsSlice';
import { useTranslation } from 'react-i18next';

const SettingsCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  width: '100%',
  margin: '0 auto',
}));

const AccessibilitySettings: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { fontSize, isHighContrast, themeMode } = useSelector(
    (state: RootState) => state.settings
  );

  // Get the previous page from location state or default to menu
  const previousPage = location.state?.from || '/menu';

  const handleFontSizeChange = (_: Event, newValue: number | number[]) => {
    dispatch(setFontSize(newValue as number));
  };

  const handleHighContrastToggle = () => {
    dispatch(toggleHighContrast());
  };

  const handleThemeChange = (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
  };

  const handleContinue = () => {
    navigate(previousPage);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('accessibility.title', 'Настройки за достъпност')}
      </Typography>

      <SettingsCard>
        <CardContent>
          {/* Font Size */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t('accessibility.fontSize', 'Размер на шрифта')}
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={fontSize}
                onChange={handleFontSizeChange}
                min={12}
                max={24}
                step={1}
                marks={[
                  { value: 12, label: 'A' },
                  { value: 16, label: 'A' },
                  { value: 20, label: 'A' },
                  { value: 24, label: 'A' },
                ]}
                valueLabelDisplay="auto"
                aria-label="font size"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* High Contrast */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t('accessibility.highContrast', 'Висок контраст')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isHighContrast}
                  onChange={handleHighContrastToggle}
                  color="primary"
                />
              }
              label={t('accessibility.highContrastDescription', 'Включва режим с висок контраст')}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Theme Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t('accessibility.theme', 'Тема')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={themeMode === 'dark'}
                    onChange={() => handleThemeChange('dark')}
                    color="primary"
                  />
                }
                label={t('accessibility.darkTheme', 'Тъмна тема')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={themeMode === 'light'}
                    onChange={() => handleThemeChange('light')}
                    color="primary"
                  />
                }
                label={t('accessibility.lightTheme', 'Светла тема')}
              />
            </Box>
          </Box>

          {/* Continue Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleContinue}
              color="primary"
              size="large"
              sx={{ minWidth: 200 }}
            >
              {t('common.continue', 'Продължи')}
            </Button>
          </Box>
        </CardContent>
      </SettingsCard>
    </Box>
  );
};

export default AccessibilitySettings; 