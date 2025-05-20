import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { RootState } from '../../store/store';
import { setLanguage, Language } from '../../store/features/settings/settingsSlice';
import { useTranslation } from 'react-i18next';

const LanguageCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const LanguageSelection: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentLanguage = useSelector((state: RootState) => state.settings.language);

  // Get the previous page from location state or default to menu
  const previousPage = location.state?.from || '/menu';

  const handleLanguageSelect = (lang: Language) => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
  };

  const handleContinue = () => {
    navigate(previousPage);
  };

  const languages = [
    { code: 'bg', name: 'Български', flag: 'BG' },
    { code: 'en', name: 'English', flag: 'EN' },
  ] as const;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: theme.palette.primary.main,
          mb: 4,
        }}
      >
        {t('welcome.title', 'Билетен терминал')}
      </Typography>

      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: theme.palette.text.secondary,
          mb: 4,
        }}
      >
        {t('welcome.selectLanguage', 'Моля, изберете език / Please select a language')}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 3,
          maxWidth: 600,
          width: '100%',
          mb: 4,
        }}
      >
        {languages.map(({ code, name, flag }) => (
          <LanguageCard
            key={code}
            onClick={() => handleLanguageSelect(code as Language)}
            sx={{
              border: currentLanguage === code ? 2 : 1,
              borderColor: currentLanguage === code ? 'primary.main' : 'divider',
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
              }}
            >
              <Typography 
                variant="h2" 
                component="span" 
                sx={{ 
                  mb: 2,
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                }}
              >
                {flag}
              </Typography>
              <Typography 
                variant="h5" 
                component="h3"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 500,
                }}
              >
                {name}
              </Typography>
            </CardContent>
          </LanguageCard>
        ))}
      </Box>

      {/* Continue Button */}
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
  );
};

export default LanguageSelection; 