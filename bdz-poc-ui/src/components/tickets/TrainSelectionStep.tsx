import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Typography,
  useTheme,
  IconButton,
  Container,
  Fade,
  Paper,
  Divider,
  Grid,
  Chip,
  Card,
  CardContent,
  Stack,
  Pagination,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrainIcon from '@mui/icons-material/Train';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DirectionsRailwayIcon from '@mui/icons-material/DirectionsRailway';
import DirectionsRailwayFilledIcon from '@mui/icons-material/DirectionsRailwayFilled';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import WarningIcon from '@mui/icons-material/Warning';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WifiIcon from '@mui/icons-material/Wifi';
import AccessibleIcon from '@mui/icons-material/Accessible';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { RootState } from '../../store/store';
import { setCurrentStep, setSelectedTrain, TicketType, Train } from '../../store/features/tickets/ticketsSlice';

// Mock data for trains
const mockTrains: Train[] = [
  {
    id: '1',
    number: '8601',
    type: 'express',
    departureTime: '06:30',
    arrivalTime: '10:45',
    duration: '4ч 15мин',
    transfers: 0,
    delay: 0,
    price: 45.80,
    features: ['restaurant', 'ac', 'wifi'],
    route: [
      { station: 'София', arrival: null, departure: '06:30', platform: '1' },
      { station: 'Пловдив', arrival: '08:15', departure: '08:20', platform: '3' },
      { station: 'Димитровград', arrival: '09:05', departure: '09:10', platform: '2' },
      { station: 'Варна', arrival: '10:45', departure: null, platform: '4' }
    ]
  },
  {
    id: '2',
    number: '7623',
    type: 'fast',
    departureTime: '07:15',
    arrivalTime: '11:30',
    duration: '4ч 15мин',
    transfers: 1,
    delay: 15,
    price: 42.50,
    features: ['ac', 'wifi'],
    route: [
      { station: 'София', arrival: null, departure: '07:15', platform: '2' },
      { station: 'Карлово', arrival: '08:45', departure: '08:50', platform: '1' },
      { station: 'Стара Загора', arrival: '09:30', departure: '09:35', platform: '3' },
      { station: 'Варна', arrival: '11:30', departure: null, platform: '5' }
    ]
  },
  {
    id: '3',
    number: '5631',
    type: 'passenger',
    departureTime: '08:00',
    arrivalTime: '13:20',
    duration: '5ч 20мин',
    transfers: 2,
    delay: 0,
    price: 35.90,
    features: ['ac'],
    route: [
      { station: 'София', arrival: null, departure: '08:00', platform: '3' },
      { station: 'Ихтиман', arrival: '08:45', departure: '08:50', platform: '1' },
      { station: 'Карлово', arrival: '09:30', departure: '09:35', platform: '2' },
      { station: 'Варна', arrival: '13:20', departure: null, platform: '4' }
    ]
  },
  {
    id: '4',
    number: '8603',
    type: 'express',
    departureTime: '09:30',
    arrivalTime: '13:45',
    duration: '4ч 15мин',
    transfers: 0,
    delay: 0,
    price: 45.80,
    features: ['restaurant', 'ac', 'wifi', 'accessible'],
    route: [
      { station: 'София', arrival: null, departure: '09:30', platform: '1' },
      { station: 'Пловдив', arrival: '11:15', departure: '11:20', platform: '3' },
      { station: 'Димитровград', arrival: '12:05', departure: '12:10', platform: '2' },
      { station: 'Варна', arrival: '13:45', departure: null, platform: '4' }
    ]
  }
];

const TrainSelectionStep: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { 
    currentStep, 
    totalSteps, 
    originStation, 
    destinationStation, 
    travelDate, 
    timeRange,
    ticketType,
    filters 
  } = useSelector((state: RootState) => state.tickets);
  const { fontSize, isHighContrast } = useSelector((state: RootState) => state.settings);
  const [page, setPage] = useState(1);
  const trainsPerPage = 2;

  // Calculate pagination
  const indexOfLastTrain = page * trainsPerPage;
  const indexOfFirstTrain = indexOfLastTrain - trainsPerPage;
  const currentTrains = mockTrains.slice(indexOfFirstTrain, indexOfLastTrain);
  const totalPages = Math.ceil(mockTrains.length / trainsPerPage);

  // Debug logs
  console.log('Redux State:', {
    currentStep,
    totalSteps,
    originStation,
    destinationStation,
    travelDate,
    timeRange,
    ticketType,
    filters
  });

  // Ensure we're on step 3
  useEffect(() => {
    if (currentStep !== 3) {
      dispatch(setCurrentStep(3));
    }
  }, [currentStep, dispatch]);

  const handleBack = () => {
    dispatch(setCurrentStep(2));
    navigate('/ticket/search');
  };

  const handleCancel = () => {
    navigate('/menu');
  };

  const handleContinue = () => {
    dispatch(setCurrentStep(4));
    navigate('/ticket/step4');
  };

  const handleTrainSelect = (train: Train) => {
    dispatch(setSelectedTrain(train));
    dispatch(setCurrentStep(4));
    navigate('/ticket/step4');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeRangeText = (range: string) => {
    const timeRanges = {
      'all': 'Цял ден',
      'morning': 'Сутрешно време (05:00 - 12:00)',
      'afternoon': 'Следобедно време (12:00 - 18:00)',
      'evening': 'Вечерно време (18:00 - 22:00)',
      'night': 'Нощно време (22:00 - 05:00)'
    };
    return timeRanges[range as keyof typeof timeRanges] || range;
  };

  const getTicketTypeIcon = (type: string) => {
    switch (type) {
      case 'oneWay':
        return <ArrowForwardIcon />;
      case 'return':
        return <SwapHorizIcon />;
      default:
        return <TrainIcon />;
    }
  };

  const getTrainTypeIcon = (type: string) => {
    switch (type) {
      case 'express':
        return <DirectionsTransitIcon color="primary" />;
      case 'fast':
        return <DirectionsRailwayFilledIcon color="primary" />;
      case 'passenger':
        return <DirectionsRailwayIcon color="primary" />;
      default:
        return <TrainIcon color="primary" />;
    }
  };

  const getTrainTypeLabel = (type: string) => {
    switch (type) {
      case 'express':
        return 'Експрес';
      case 'fast':
        return 'Бърз';
      case 'passenger':
        return 'Пътнически';
      default:
        return type;
    }
  };

  const getTicketTypeLabel = (type: string) => {
    switch (type) {
      case 'oneWay':
        return 'Еднопосочен билет';
      case 'return':
        return 'Двупосочен билет';
      default:
        return 'Билет';
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} лв.`;
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Fade in={true}>
      <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
            px: 1,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <IconButton
            onClick={handleBack}
            color="primary"
            aria-label="Назад"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: `${fontSize}px`,
              color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
            }}
          >
            Стъпка {currentStep} от {totalSteps}
          </Typography>

          <IconButton
            onClick={handleCancel}
            color="primary"
            aria-label="Отказ"
            sx={{ ml: 2 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', p: 2 }}>
          {/* Title */}
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              mb: 4,
              fontSize: `${fontSize * 1.5}px`,
              color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
            }}
          >
            Изберете влак
          </Typography>

          {/* Route Information Section */}
          <Paper 
            elevation={3}
            sx={{
              p: 2,
              mb: 4,
              borderRadius: 2,
              backgroundColor: isHighContrast ? theme.palette.primary.main : theme.palette.background.paper,
              color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Ticket Type, Route, Date and Time */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {/* Ticket Type */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: '0 0 auto' }}>
                  {getTicketTypeIcon(ticketType || 'oneWay')}
                  <Typography variant="h6" sx={{ fontSize: `${fontSize}px`, whiteSpace: 'nowrap' }}>
                    {getTicketTypeLabel(ticketType || 'oneWay')}
                  </Typography>
                </Box>

                {/* Route */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: '1 1 auto', minWidth: 0 }}>
                  <LocationOnIcon color="primary" />
                  <Typography sx={{ fontSize: `${fontSize}px`, whiteSpace: 'nowrap' }}>
                    {originStation?.name || 'Изберете начална гара'} → {destinationStation?.name || 'Изберете крайна гара'}
                  </Typography>
                </Box>

                {/* Date and Time */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: '0 0 auto' }}>
                  <CalendarTodayIcon color="action" sx={{ fontSize: fontSize * 0.9 }} />
                  <Typography sx={{ fontSize: `${fontSize * 0.9}px`, whiteSpace: 'nowrap' }}>
                    {travelDate ? formatDate(travelDate) : 'Изберете дата'} • {timeRange ? getTimeRangeText(timeRange) : 'Изберете време'}
                  </Typography>
                </Box>
              </Box>

              {/* Active Filters */}
              {filters && Object.entries(filters).some(([_, value]) => value) && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {filters.fastTrainsOnly && (
                    <Chip 
                      size="small" 
                      label="Бързи влакове"
                      sx={{ fontSize: `${fontSize * 0.8}px` }}
                    />
                  )}
                  {filters.directTrainsOnly && (
                    <Chip 
                      size="small" 
                      label="Директни влакове"
                      sx={{ fontSize: `${fontSize * 0.8}px` }}
                    />
                  )}
                  {filters.sleepingCarsOnly && (
                    <Chip 
                      size="small" 
                      label="Спални вагони"
                      sx={{ fontSize: `${fontSize * 0.8}px` }}
                    />
                  )}
                  {filters.firstClassOnly && (
                    <Chip 
                      size="small" 
                      label="Първа класа"
                      sx={{ fontSize: `${fontSize * 0.8}px` }}
                    />
                  )}
                  {filters.accessibleCarsOnly && (
                    <Chip 
                      size="small" 
                      label="Достъпни вагони"
                      sx={{ fontSize: `${fontSize * 0.8}px` }}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Paper>

          {/* Train List */}
          <Box sx={{ mt: 2, mb: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                fontSize: `${fontSize}px`,
                color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
              }}
            >
              Налични влакове ({mockTrains.length})
            </Typography>
            
            <Stack spacing={2}>
              {currentTrains.map((train) => (
                <Card 
                  key={train.id}
                  elevation={2}
                  onClick={() => handleTrainSelect(train)}
                  sx={{
                    backgroundColor: isHighContrast ? theme.palette.primary.main : theme.palette.background.paper,
                    color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
                    '&:hover': {
                      backgroundColor: isHighContrast 
                        ? theme.palette.primary.dark 
                        : theme.palette.action.hover,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out',
                    },
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Train Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTrainTypeIcon(train.type)}
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontSize: `${fontSize}px`,
                              fontWeight: 'bold',
                            }}
                          >
                            {train.number} - {getTrainTypeLabel(train.type)}
                          </Typography>
                        </Box>
                        {train.delay > 0 && (
                          <Chip
                            icon={<WarningIcon />}
                            label={`Закъснение ${train.delay} мин`}
                            color="warning"
                            size="small"
                            sx={{ fontSize: `${fontSize * 0.8}px` }}
                          />
                        )}
                      </Box>

                      {/* Train Times */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon color="primary" />
                          <Typography sx={{ fontSize: `${fontSize}px` }}>
                            {train.departureTime}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon color="primary" />
                          <Typography sx={{ fontSize: `${fontSize}px` }}>
                            {train.arrivalTime}
                          </Typography>
                        </Box>
                        <Typography 
                          sx={{ 
                            fontSize: `${fontSize * 0.9}px`,
                            color: 'text.secondary',
                          }}
                        >
                          {train.duration}
                        </Typography>
                      </Box>

                      {/* Route Details */}
                      {train.route && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontSize: `${fontSize * 0.9}px`,
                              color: 'text.secondary',
                              mb: 1
                            }}
                          >
                            Маршрут
                          </Typography>
                          <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            overflowX: 'auto',
                            pb: 1,
                            '&::-webkit-scrollbar': {
                              height: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                              backgroundColor: theme.palette.divider,
                              borderRadius: '2px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              backgroundColor: theme.palette.primary.main,
                              borderRadius: '2px',
                            },
                          }}>
                            {train.route.map((stop, index) => (
                              <React.Fragment key={index}>
                                <Typography 
                                  sx={{ 
                                    fontSize: `${fontSize * 0.9}px`,
                                    fontWeight: stop.station === originStation?.name || 
                                              stop.station === destinationStation?.name 
                                              ? 'bold' 
                                              : 'normal',
                                    whiteSpace: 'nowrap',
                                    color: stop.station === originStation?.name || 
                                           stop.station === destinationStation?.name
                                           ? theme.palette.primary.main
                                           : 'inherit',
                                  }}
                                >
                                  {stop.station}
                                </Typography>
                                {index < train.route.length - 1 && (
                                  <ArrowForwardIcon 
                                    sx={{ 
                                      fontSize: fontSize * 0.8,
                                      color: theme.palette.divider,
                                    }} 
                                  />
                                )}
                              </React.Fragment>
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* Train Details */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {train.transfers > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SwapHorizOutlinedIcon color="action" />
                            <Typography sx={{ fontSize: `${fontSize * 0.9}px` }}>
                              {train.transfers} {train.transfers === 1 ? 'прекачване' : 'прекачвания'}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ flex: 1 }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontSize: `${fontSize}px`,
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                          }}
                        >
                          {formatPrice(train.price)}
                        </Typography>
                      </Box>

                      {/* Train Features */}
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {train.features.includes('restaurant') && (
                          <Tooltip title="Вагон-ресторант" arrow>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              color: theme.palette.primary.main,
                              '&:hover': {
                                color: theme.palette.primary.dark,
                              }
                            }}>
                              <RestaurantIcon sx={{ fontSize: fontSize * 1.2 }} />
                            </Box>
                          </Tooltip>
                        )}
                        {train.features.includes('ac') && (
                          <Tooltip title="Климатизация" arrow>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              color: theme.palette.primary.main,
                              '&:hover': {
                                color: theme.palette.primary.dark,
                              }
                            }}>
                              <AcUnitIcon sx={{ fontSize: fontSize * 1.2 }} />
                            </Box>
                          </Tooltip>
                        )}
                        {train.features.includes('wifi') && (
                          <Tooltip title="Wi-Fi" arrow>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              color: theme.palette.primary.main,
                              '&:hover': {
                                color: theme.palette.primary.dark,
                              }
                            }}>
                              <WifiIcon sx={{ fontSize: fontSize * 1.2 }} />
                            </Box>
                          </Tooltip>
                        )}
                        {train.features.includes('accessible') && (
                          <Tooltip title="Достъп за инвалиди" arrow>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              color: theme.palette.primary.main,
                              '&:hover': {
                                color: theme.palette.primary.dark,
                              }
                            }}>
                              <AccessibleIcon sx={{ fontSize: fontSize * 1.2 }} />
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 3,
                  '& .MuiPaginationItem-root': {
                    fontSize: `${fontSize * 0.9}px`,
                    minWidth: '40px',
                    height: '40px',
                  },
                  '& .MuiPaginationItem-page.Mui-selected': {
                    backgroundColor: isHighContrast 
                      ? theme.palette.primary.dark 
                      : theme.palette.primary.main,
                    color: isHighContrast 
                      ? theme.palette.primary.contrastText 
                      : theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: isHighContrast 
                        ? theme.palette.primary.dark 
                        : theme.palette.primary.dark,
                    },
                  },
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Fade>
  );
};

export default TrainSelectionStep; 