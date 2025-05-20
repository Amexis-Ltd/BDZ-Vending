import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectIsCustomerLoggedIn } from '../store/features/auth/authSlice';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/features/auth/authSlice';

// Define section keys
type ProfileSection = 'personal-data' | 'travel-history' | 'saved-preferences' | 'settings' | 'ticket-management';

const ProfileNav = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  height: 'fit-content',
  position: 'sticky',
  top: theme.spacing(10), // Adjust based on AppBar height if needed
  [theme.breakpoints.down('md')]: {
    position: 'static',
    marginBottom: theme.spacing(2),
  },
}));

const ProfileSectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const DataDisplayGroup = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px dashed ${theme.palette.divider}`,
  position: 'relative',
  '&:last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  },
}));

const ItemEntry = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(2),
  '&:last-child': {
    borderBottom: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

const CustomerProfilePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ProfileSection>('personal-data');
  const navigate = useNavigate();
  const isCustomerLoggedIn = useAppSelector(selectIsCustomerLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isCustomerLoggedIn) {
      navigate('/customer-login', { replace: true, state: { from: '/profile' } });
    }
  }, [isCustomerLoggedIn, navigate]);

  const handleNavClick = (section: ProfileSection) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems: { key: ProfileSection; label: string; icon: React.ReactElement }[] = [
    { key: 'personal-data', label: 'Лични данни', icon: <AccountCircleIcon /> },
    { key: 'travel-history', label: 'История', icon: <HistoryIcon /> },
    { key: 'saved-preferences', label: 'Запазени', icon: <SaveIcon /> },
    { key: 'settings', label: 'Настройки', icon: <SettingsIcon /> },
    { key: 'ticket-management', label: 'Моите билети', icon: <ConfirmationNumberIcon /> },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal-data':
        return (
          <ProfileSectionCard>
            <Typography variant="h5" component="h2" gutterBottom><AccountCircleIcon sx={{ mr: 1, verticalAlign: 'bottom' }}/> Лични данни</Typography>
            <DataDisplayGroup sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" display="block" color="text.secondary">Име:</Typography>
                <Typography>Иван Петров</Typography>
              </Box>
              <Button size="small" variant="outlined" startIcon={<EditIcon />} sx={{ flexShrink: 0, ml: 2 }}>Редактирай</Button>
            </DataDisplayGroup>
            <DataDisplayGroup sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" display="block" color="text.secondary">Имейл адрес:</Typography>
                <Typography>ivan.petrov@email.com</Typography>
              </Box>
              <Button size="small" variant="outlined" startIcon={<EditIcon />} sx={{ flexShrink: 0, ml: 2 }}>Редактирай</Button>
            </DataDisplayGroup>
            <DataDisplayGroup sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" display="block" color="text.secondary">Телефонен номер:</Typography>
                <Typography>+359 88 123 4567</Typography>
              </Box>
              <Button size="small" variant="outlined" startIcon={<EditIcon />} sx={{ flexShrink: 0, ml: 2 }}>Редактирай</Button>
            </DataDisplayGroup>
             <DataDisplayGroup>
              <Typography variant="caption" display="block" color="text.secondary">Парола:</Typography>
              <Button size="small" variant="outlined">Смяна на парола</Button>
            </DataDisplayGroup>
          </ProfileSectionCard>
        );
      case 'travel-history':
        return (
          <ProfileSectionCard>
            <Typography variant="h5" component="h2" gutterBottom><HistoryIcon sx={{ mr: 1, verticalAlign: 'bottom' }}/> История на пътуванията</Typography>
            <ItemEntry>
              <Box flexGrow={1}>
                <Typography variant="body1" component="span" fontWeight="bold">София - Варна</Typography><br/>
                <Typography variant="body2" color="text.secondary">01.03.2025 | 30.80 лв.</Typography>
              </Box>
              <Button size="small" variant="outlined" startIcon={<ConfirmationNumberIcon />}>Преглед билет</Button>
            </ItemEntry>
             <ItemEntry>
              <Box flexGrow={1}>
                <Typography variant="body1" component="span" fontWeight="bold">Пловдив - Бургас</Typography><br/>
                <Typography variant="body2" color="text.secondary">15.02.2025 | 15.50 лв.</Typography>
              </Box>
              <Button size="small" variant="outlined" startIcon={<ConfirmationNumberIcon />}>Преглед билет</Button>
            </ItemEntry>
          </ProfileSectionCard>
        );
      case 'saved-preferences':
        return (
          <ProfileSectionCard>
            <Typography variant="h5" component="h2" gutterBottom><SaveIcon sx={{ mr: 1, verticalAlign: 'bottom' }}/> Запазени предпочитания</Typography>
            {/* TODO: Implement Saved Preferences UI */}
            <Typography variant="body2">Запазени маршрути, пътници и плащания ще се показват тук.</Typography>
          </ProfileSectionCard>
        );
      case 'settings':
        return (
          <ProfileSectionCard>
            <Typography variant="h5" component="h2" gutterBottom><SettingsIcon sx={{ mr: 1, verticalAlign: 'bottom' }}/> Настройки</Typography>
            <Box mb={2}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Получавай известия по имейл/SMS за закъснения/промени" />
            </Box>
             <Box mb={2}>
                 <FormControlLabel control={<Checkbox />} label="Абонирай ме за промоционални оферти и новини" />
            </Box>
            <Box mb={2}>
                <TextField select label="Предпочитан език" defaultValue="bg" fullWidth>
                    <MenuItem value="bg">Български</MenuItem>
                    <MenuItem value="en" disabled>Английски (скоро)</MenuItem>
                </TextField>
            </Box>
             <Button variant="contained" startIcon={<SaveAltIcon />}>Запази настройките</Button>
          </ProfileSectionCard>
        );
      case 'ticket-management':
        return (
          <ProfileSectionCard>
            <Typography variant="h5" component="h2" gutterBottom><ConfirmationNumberIcon sx={{ mr: 1, verticalAlign: 'bottom' }}/> Моите билети (Активни)</Typography>
            <ItemEntry>
              <Box flexGrow={1}>
                <Typography variant="body1" component="span" fontWeight="bold">София - Бургас</Typography><br/>
                <Typography variant="body2" color="text.secondary">15.04.2025 | Билет #12345678</Typography>
              </Box>
              <Typography component="span" sx={{ 
                  fontWeight: 'bold', 
                  px: 1, py: 0.2, 
                  borderRadius: 1, 
                  fontSize: '0.85rem', 
                  bgcolor: 'success.light', 
                  color: 'success.contrastText' 
              }}>Активен</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                  <Button size="small" variant="outlined" startIcon={<EditIcon />}>Промяна</Button>
                  <Button size="small" variant="outlined" color="error" startIcon={<CloseIcon />}>Анулиране</Button>
                  <Button size="small" variant="contained" startIcon={<DownloadIcon />}>Свали</Button>
              </Box>
            </ItemEntry>
             <ItemEntry>
              <Box flexGrow={1}>
                <Typography variant="body1" component="span" fontWeight="bold">Пловдив - София</Typography><br/>
                <Typography variant="body2" color="text.secondary">05.04.2025 | Билет #87654321</Typography>
              </Box>
               <Typography component="span" sx={{ 
                  fontWeight: 'bold', 
                  px: 1, py: 0.2, 
                  borderRadius: 1, 
                  fontSize: '0.85rem', 
                  bgcolor: 'error.light', 
                  color: 'error.contrastText' 
              }}>Анулиран</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                   <Button size="small" variant="contained" startIcon={<DownloadIcon />} disabled>Свали</Button>
              </Box>
            </ItemEntry>
             <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                Забележка: Промяната и анулирането на билети са възможни според Общите условия.
            </Typography>
          </ProfileSectionCard>
        );
      default:
        return null;
    }
  };

  if (!isCustomerLoggedIn) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        <AccountCircleIcon fontSize="large" sx={{ mr: 1, verticalAlign: 'middle' }} />
        Потребителски профил
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ width: { xs: '100%', md: '25%' }, flexShrink: 0 }}>
          <ProfileNav elevation={2}>
            <List component="nav">
              {navItems.map((item) => (
                <ListItem key={item.key} disablePadding>
                  <ListItemButton
                    selected={activeSection === item.key}
                    onClick={() => handleNavClick(item.key)}
                  >
                    <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}><LogoutIcon /></ListItemIcon>
                  <ListItemText primary="Изход" />
                </ListItemButton>
              </ListItem>
            </List>
          </ProfileNav>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {renderSectionContent()}
        </Box>
      </Box>
    </Container>
  );
};

export default CustomerProfilePage; 