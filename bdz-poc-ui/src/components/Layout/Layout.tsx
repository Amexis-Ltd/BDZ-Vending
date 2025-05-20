import React, { ReactNode, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // Cashier Login
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // General Logout
import MenuIcon from '@mui/icons-material/Menu';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
// Import all needed state selectors and actions
import {
  selectIsLoggedIn, // General login status
  selectIsCashierLoggedIn,
  selectIsCustomerLoggedIn,
  selectUsername, // Will hold either cashier username or customer identifier
  selectUserRole,
  logout, // Use the single logout action
} from '../../store/features/auth/authSlice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import InfoIcon from '@mui/icons-material/Info';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../store/features/settings/settingsSlice';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  icon: React.ReactElement;
  path?: string;
  action?: () => void;
  show?: 'always' | 'loggedOut' | 'loggedInCustomer' | 'loggedInCashier'; // Control visibility
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Get all relevant auth states
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isCashierLoggedIn = useAppSelector(selectIsCashierLoggedIn);
  const isCustomerLoggedIn = useAppSelector(selectIsCustomerLoggedIn);
  const username = useAppSelector(selectUsername);
  const userRole = useAppSelector(selectUserRole);
  const { t, i18n } = useTranslation();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Use the general logout action
  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/'); // Navigate to home after logout
  };

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === 'bg' ? 'en' : 'bg';
    i18n.changeLanguage(newLanguage);
    dispatch(setLanguage(newLanguage));
  };

  // --- Define All Navigation Items --- 
  const navigationItems: NavItem[] = [
    // Always Visible
    { label: 'Начало', path: '/', icon: <HomeIcon sx={{ mr: 1 }} />, show: 'always' },
    { label: 'Разписания', path: '/schedule', icon: <ScheduleIcon sx={{ mr: 1 }} />, show: 'always' },
    { label: 'Информация', path: '/travel-info', icon: <InfoIcon sx={{ mr: 1 }} />, show: 'always' },
    // Logged Out Only
    { label: 'Вход клиент', path: '/customer-login', icon: <AccountCircleIcon sx={{ mr: 1 }} />, show: 'loggedOut' },
    { label: 'Вход касиер', path: '/cashier-login', icon: <VpnKeyIcon sx={{ mr: 1 }} />, show: 'loggedOut' },
    // Logged In Customer Only
    { label: 'Моят профил', path: '/profile', icon: <AccountCircleIcon sx={{ mr: 1 }} />, show: 'loggedInCustomer' },
    // Logged In Cashier Only
    { label: 'Касиерски панел', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 1 }} />, show: 'loggedInCashier' }, // Placeholder
    // { label: 'Издаване на билети', path: '/cashier/tickets', icon: <ReceiptIcon sx={{ mr: 1 }} />, show: 'loggedInCashier' }, // If needed
    // Logged In (Any Role)
    // Using separate items for logout because filtering logic checks specific roles
    { label: 'Изход', action: handleLogout, icon: <ExitToAppIcon sx={{ mr: 1 }} />, show: 'loggedInCustomer' },
    { label: 'Изход', action: handleLogout, icon: <ExitToAppIcon sx={{ mr: 1 }} />, show: 'loggedInCashier' },
  ];

  // Filter items based on login state and role
  const getFilteredNavItems = (): NavItem[] => {
    return navigationItems.filter(item => {
      // Check against specific states from Redux
      if (item.show === 'always') return true;
      if (item.show === 'loggedOut' && !isCustomerLoggedIn && !isCashierLoggedIn) return true; // Check both are false
      if (item.show === 'loggedInCustomer' && isCustomerLoggedIn) return true;
      if (item.show === 'loggedInCashier' && isCashierLoggedIn) return true;
      return false;
    });
  };
  
  const renderMenuItems = (isMobileMenu = true) => {
    const items = getFilteredNavItems();
    let firstLoginItemRendered = false; // Track if we've hit the first login item

    return items.map((item, index) => {
      const itemKey = item.label + (item.path || '_action');
      const elements: React.ReactNode[] = [];

      // Check if this is the first login item to render when logged out
      if (!isCustomerLoggedIn && !isCashierLoggedIn && item.show === 'loggedOut' && !firstLoginItemRendered) {
        if (index > 0) { // Don't add divider if it's the very first item
             elements.push(<Divider key={`${itemKey}-divider`} sx={{ my: 0.5 }} />);
        }
        firstLoginItemRendered = true;
      }

      // Render the actual item
      if (item.path) {
        elements.push(
          <MenuItem
            key={itemKey}
            component={Link}
            to={item.path}
            onClick={handleMenuClose}
          >
            {isMobileMenu && item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.label} />
          </MenuItem>
        );
      } else if (item.action) {
        elements.push(
          <MenuItem key={itemKey} onClick={() => { item.action?.(); handleMenuClose(); }}>
            {isMobileMenu && item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.label} />
          </MenuItem>
        );
      }
      // Return array of elements (potentially including divider)
      return elements;
    });
  };

  const renderDesktopButtons = () => {
    const items = getFilteredNavItems();
    let firstLoginItemRendered = false;

    return items.map((item, index) => {
      const itemKey = item.label + (item.path || '_action');
      const elements: React.ReactNode[] = [];

       // Add visual separator before the first login button
       if (!isCustomerLoggedIn && !isCashierLoggedIn && item.show === 'loggedOut' && !firstLoginItemRendered) {
           if (index > 0) { // Don't add separator if it's the first button
               elements.push(
                   <Box key={`${itemKey}-separator`} sx={{ borderLeft: 1, borderColor: 'rgba(255, 255, 255, 0.3)', height: '24px', alignSelf: 'center', mx: 1 }} />
               );
           }
           firstLoginItemRendered = true;
       }

      // Render the actual button
      if (item.path) {
        elements.push(
          <Button
            key={itemKey}
            color="inherit"
            component={Link}
            to={item.path}
            startIcon={item.icon}
          >
            {item.label}
          </Button>
        );
      } else if (item.action) {
        elements.push(
          <Button key={itemKey} color="inherit" onClick={item.action} startIcon={item.icon}>
            {item.label}
          </Button>
        );
      }
      // Return array of elements (potentially including separator)
      return elements;
    });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      pb: '60px', // Add padding bottom to account for footer height
      overflow: 'auto' // Enable scrolling for the entire container
    }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            БДЖ Пътнически превози
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Settings buttons in the right corner */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            alignItems: 'center'
          }}>
            <Button
              color="inherit"
              onClick={() => navigate('/accessibility', { state: { from: location.pathname } })}
              startIcon={<AccessibilityIcon />}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 'auto',
                px: 1,
                '& .MuiButton-startIcon': {
                  margin: 0,
                  marginBottom: 0.5
                }
              }}
            >
              <Typography variant="caption" sx={{ lineHeight: 1 }}>
                {t('menu.accessibility', 'Достъпност')}
              </Typography>
            </Button>
            <Button
              color="inherit"
              onClick={handleLanguageChange}
              startIcon={<LanguageIcon />}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 'auto',
                px: 1,
                '& .MuiButton-startIcon': {
                  margin: 0,
                  marginBottom: 0.5
                }
              }}
            >
              <Typography variant="caption" sx={{ lineHeight: 1 }}>
                {i18n.language === 'bg' ? 'ENGLISH' : 'БЪЛГАРСКИ'}
              </Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 64px - 60px)', // Subtract AppBar height and footer height
        position: 'relative'
      }}>
        <Container 
          component="main" 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            position: 'relative',
            '& > *': { // Target direct children
              width: '100%',
              maxWidth: '100%'
            }
          }}
        >
          {children}
        </Container>
      </Box>
      <Box
        component="footer"
        sx={{
          py: 2,
          px: { xs: 1, sm: 2 },
          width: '100%',
          backgroundColor: (theme) => theme.palette.secondary.main,
          color: (theme) => theme.palette.getContrastText(theme.palette.secondary.main),
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000
        }}
      >
        <Container>
          <Typography 
            variant="body2" 
            align="center"
            sx={{
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            {'© '}
            {new Date().getFullYear()}
            {' БДЖ Пътнически превози'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 