import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  Link,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import type { GridProps } from '@mui/material/Grid';
import { styled, alpha } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import LocationCityIcon from '@mui/icons-material/LocationCity'; // For Гари
import TrainIcon from '@mui/icons-material/Train'; // For Влакове
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna'; // For Актуална информация
import NotificationsIcon from '@mui/icons-material/Notifications'; // For Абонамент
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // For Address/Marker
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CoffeeIcon from '@mui/icons-material/Coffee';
import WifiIcon from '@mui/icons-material/Wifi';
import WcIcon from '@mui/icons-material/Wc'; // Restroom
import AccessibleIcon from '@mui/icons-material/Accessible'; // Accessibility
import LuggageIcon from '@mui/icons-material/Luggage'; // Baggage
import AcUnitIcon from '@mui/icons-material/AcUnit'; // AC
import ChairIcon from '@mui/icons-material/Chair'; // Seats
import RestaurantIcon from '@mui/icons-material/Restaurant'; // Dining
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'; // Bikes
import SendIcon from '@mui/icons-material/Send'; // Subscribe button
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';

// --- Styled Components (Adapting CSS) ---

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%', // Ensure cards in grid have same height
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[2],
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const AmenitiesChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.25),
  backgroundColor: alpha(theme.palette.primary.light, 0.1), // Subtle background
  color: theme.palette.primary.dark, // Darker text for contrast
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  },
}));

const NotAvailableChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.25),
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.grey[600],
  textDecoration: 'line-through',
  '& .MuiChip-icon': {
    color: theme.palette.grey[400],
  },
}));

const StationSearchCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

const NavigationBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const NavigationButton = styled(Button)(({ theme }) => ({
  minWidth: '120px',
  height: '48px',
  fontSize: '1.1rem',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

const PageIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  '& .MuiTypography-root': {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
}));

// --- TravelInfoPage Component ---
const TravelInfoPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 3; // Гари, Влакове, Актуална информация

  const handleSearch = () => {
    alert('Търсенето на гара все още не е имплементирано.');
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleHome = () => {
    navigate('/menu');
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 0: // Гари
        return (
          <Section>
            <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'primary.main', pb: 0.5 }}>
              <LocationCityIcon sx={{ mr: 1 }} /> Информация за гарите
            </Typography>

            <StationSearchCard variant="outlined">
              <TextField
                label="Търсене на гара"
                variant="outlined"
                placeholder="Въведете име на гара..."
                fullWidth
                size="small"
              />
              <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />} size="small">
                Търси
              </Button>
            </StationSearchCard>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
              {/* Station Card Example 1 */}
              <Box>
                <StyledCard>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ mr: 0.5, color: 'primary.main', fontSize: '1.2rem' }} /> Централна гара София
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Адрес:</strong> бул. „Княгиня Мария Луиза" 102, 1202 София
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25 }}>
                      <AmenitiesChip icon={<ShoppingCartIcon />} label="Магазини" size="small" />
                      <AmenitiesChip icon={<CoffeeIcon />} label="Кафенета" size="small" />
                      <AmenitiesChip icon={<WifiIcon />} label="Wi-Fi" size="small" />
                      <AmenitiesChip icon={<WcIcon />} label="Тоалетни" size="small" />
                      <AmenitiesChip icon={<InfoIcon />} label="Инфо център" size="small" />
                      <AmenitiesChip icon={<AccessibleIcon />} label="Достъпност" size="small" />
                    </Box>
                  </CardContent>
                </StyledCard>
              </Box>

              {/* Station Card Example 2 */}
              <Box>
                <StyledCard>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ mr: 0.5, color: 'primary.main', fontSize: '1.2rem' }} /> Гара Пловдив
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Адрес:</strong> бул. „Христо Ботев" 46, 4000 Пловдив
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25 }}>
                      <AmenitiesChip icon={<ShoppingCartIcon />} label="Магазини" size="small" />
                      <AmenitiesChip icon={<CoffeeIcon />} label="Кафене" size="small" />
                      <NotAvailableChip icon={<WifiIcon />} label="Wi-Fi" size="small" />
                      <AmenitiesChip icon={<WcIcon />} label="Тоалетни" size="small" />
                      <AmenitiesChip icon={<InfoIcon />} label="Информация" size="small" />
                    </Box>
                  </CardContent>
                </StyledCard>
              </Box>
            </Box>
          </Section>
        );

      case 1: // Влакове
        return (
          <Section>
            <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'primary.main', pb: 0.5 }}>
              <TrainIcon sx={{ mr: 1 }} /> Информация за влаковете
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
              {/* Train Type 1 */}
              <Box>
                <StyledCard>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1" component="h3" gutterBottom>Бърз влак (БВ/БВЗР)</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      За дълги разстояния, спира само на големи гари.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25 }}>
                      <AmenitiesChip icon={<AcUnitIcon />} label="Климатик" size="small" />
                      <AmenitiesChip icon={<WifiIcon />} label="Wi-Fi" size="small" />
                      <AmenitiesChip icon={<WcIcon />} label="Тоалетни" size="small" />
                      <AmenitiesChip icon={<ChairIcon />} label="Места" size="small" />
                    </Box>
                  </CardContent>
                </StyledCard>
              </Box>

              {/* Train Type 2 */}
              <Box>
                <StyledCard>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1" component="h3" gutterBottom>Пътнически влак (ПВ)</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      За къси разстояния, спира на всички гари.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25 }}>
                      <NotAvailableChip icon={<AcUnitIcon />} label="Климатик" size="small" />
                      <NotAvailableChip icon={<WifiIcon />} label="Wi-Fi" size="small" />
                      <AmenitiesChip icon={<WcIcon />} label="Тоалетни" size="small" />
                      <AmenitiesChip icon={<ChairIcon />} label="Места" size="small" />
                    </Box>
                  </CardContent>
                </StyledCard>
              </Box>

              {/* Train Type 3 */}
              <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                <StyledCard>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1" component="h3" gutterBottom>Крайградски пътнически (КПВ)</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      За градски маршрути, модерни мотрисни влакове.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25 }}>
                      <AmenitiesChip icon={<AcUnitIcon />} label="Климатик" size="small" />
                      <NotAvailableChip icon={<WifiIcon />} label="Wi-Fi" size="small" />
                      <AmenitiesChip icon={<WcIcon />} label="Тоалетни" size="small" />
                      <AmenitiesChip icon={<AccessibleIcon />} label="Достъпност" size="small" />
                      <AmenitiesChip icon={<DirectionsBikeIcon />} label="Велосипеди" size="small" />
                    </Box>
                  </CardContent>
                </StyledCard>
              </Box>
            </Box>
          </Section>
        );

      case 2: // Актуална информация
        return (
          <Section>
            <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'primary.main', pb: 0.5 }}>
              <SettingsInputAntennaIcon sx={{ mr: 1 }} /> Актуална информация
            </Typography>
            <Alert severity="info" sx={{ mt: 1 }}>
              За информация относно закъснения и промени в разписанията в реално време, моля, проверете секция{' '}
              <Link component={RouterLink} to="/timetable">Разписания</Link>.
            </Alert>
          </Section>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavigationBar>
        <NavigationButton
          variant="contained"
          color="primary"
          onClick={handleHome}
          startIcon={<HomeIcon />}
        >
          Меню
        </NavigationButton>
        <PageIndicator>
          <NavigationButton
            variant="outlined"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            startIcon={<ArrowBackIcon />}
          >
            Назад
          </NavigationButton>
          <Typography>
            {currentPage + 1} / {totalPages}
          </Typography>
          <NavigationButton
            variant="outlined"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            endIcon={<ArrowForwardIcon />}
          >
            Напред
          </NavigationButton>
        </PageIndicator>
      </NavigationBar>

      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <InfoIcon fontSize="inherit" sx={{ mr: 1 }} /> Информация за пътуването
      </Typography>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {renderPageContent()}
      </Box>
    </Container>
  );
};

export default TravelInfoPage; 