import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import LanguageIcon from '@mui/icons-material/Language';

const MenuCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const MainMenu: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('menu.buyTicket', 'Купи билет'),
      icon: <ShoppingCartIcon sx={{ fontSize: 48 }} />,
      path: '/ticket/type',
      color: theme.palette.primary.main,
    },
    {
      title: t('menu.schedule', 'Разписание'),
      icon: <ScheduleIcon sx={{ fontSize: 48 }} />,
      path: '/schedule',
      color: theme.palette.secondary.main,
    },
    {
      title: t('menu.travelInfo', 'Пътна информация'),
      icon: <HelpOutlineIcon sx={{ fontSize: 48 }} />,
      path: '/travel-info',
      color: theme.palette.info.main,
    },
  ];

  const settingsItems = [
    {
      title: t('menu.accessibility', 'Достъпност'),
      icon: <AccessibilityIcon sx={{ fontSize: 32 }} />,
      path: '/accessibility',
    },
    {
      title: t('menu.language', 'Език'),
      icon: <LanguageIcon sx={{ fontSize: 32 }} />,
      path: '/language',
    },
  ];

  return (
    <Box 
      sx={{ 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ 
          textAlign: 'center', 
          mb: 4,
          mt: 4,
        }}
      >
        {t('menu.title', 'Билетен терминал')}
      </Typography>

      {/* Main Menu Items */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          width: '100%',
          maxWidth: 600,
          mb: 4,
        }}
      >
        {menuItems.map((item) => (
          <MenuCard
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              width: '100%',
              borderTop: 4,
              borderColor: item.color,
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
              <Box
                sx={{
                  color: item.color,
                  mb: 2,
                }}
              >
                {item.icon}
              </Box>
              <Typography variant="h5" component="h2" align="center">
                {item.title}
              </Typography>
            </CardContent>
          </MenuCard>
        ))}
      </Box>

      {/* Settings Menu */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mt: 'auto',
          mb: 4,
        }}
      >
        {settingsItems.map((item) => (
          <IconButton
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
            }}
          >
            {item.icon}
            <Typography variant="caption" sx={{ mt: 1 }}>
              {item.title}
            </Typography>
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default MainMenu; 