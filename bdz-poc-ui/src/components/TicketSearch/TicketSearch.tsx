import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  useTheme,
  IconButton,
  Fade,
  Container,
  Autocomplete,
  TextField,
  Paper,
  Chip,
  Alert,
  Snackbar,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { bg } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { RootState } from '../../store/store';
import {
  setOriginStation,
  setDestinationStation,
  setUseCurrentLocation,
  swapStations,
  Station,
  popularStations,
  setCurrentStep,
  setTravelDate,
  setTimeRange,
  setFilters,
  Filters,
} from '../../store/features/tickets/ticketsSlice';

// Styled components
const StationChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const TimeRangeButton = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const TicketSearch: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { currentStep, totalSteps, originStation, destinationStation, useCurrentLocation, travelDate, timeRange, filters } = useSelector(
    (state: RootState) => state.tickets
  );
  const { fontSize, isHighContrast } = useSelector((state: RootState) => state.settings);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    travelDate ? new Date(travelDate) : new Date()
  );
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange || 'all');
  const [selectedFilters, setSelectedFilters] = useState<Filters>(filters || {
    fastTrainsOnly: false,
    directTrainsOnly: false,
    sleepingCarsOnly: false,
    firstClassOnly: false,
    accessibleCarsOnly: false
  });

  // Set step 2 when component mounts
  useEffect(() => {
    dispatch(setCurrentStep(2));
  }, [dispatch]);

  const handleBack = () => {
    dispatch(setCurrentStep(1));
    navigate('/ticket/type');
  };

  const handleCancel = () => {
    navigate('/menu');
  };

  const handleContinue = () => {
    if (!originStation || !destinationStation) {
      setError(t('destination.validation.required'));
      return;
    }
    if (originStation.id === destinationStation.id) {
      setError(t('destination.validation.sameStation'));
      return;
    }
    if (!selectedDate) {
      return;
    }

    dispatch(setTravelDate(selectedDate.toISOString()));
    dispatch(setTimeRange(selectedTimeRange));
    dispatch(setFilters(selectedFilters));
    dispatch(setCurrentStep(3));
    navigate('/ticket/train-selection');
  };

  const handleUseLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      setError(t('ticketSelection.destination.location.loading'));
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setError(t('ticketSelection.destination.location.notImplemented'));
          dispatch(setUseCurrentLocation(false));
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = t('ticketSelection.destination.location.error');
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = t('ticketSelection.destination.location.permissionDenied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = t('ticketSelection.destination.location.unavailable');
              break;
            case error.TIMEOUT:
              errorMessage = t('ticketSelection.destination.location.timeout');
              break;
          }
          setError(errorMessage);
          dispatch(setUseCurrentLocation(false));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError(t('ticketSelection.destination.location.notSupported'));
      dispatch(setUseCurrentLocation(false));
    }
  }, [dispatch, t]);

  const handleSwapStations = () => {
    dispatch(swapStations());
  };

  const getStationLabel = (station: Station) => {
    return i18n.language === 'bg' ? station.name : station.nameEn;
  };

  const filterStations = (options: Station[], { inputValue }: { inputValue: string }) => {
    const searchTerm = inputValue.toLowerCase();
    return options.filter(
      (station) =>
        station.name.toLowerCase().includes(searchTerm) ||
        station.nameEn.toLowerCase().includes(searchTerm) ||
        station.code.toLowerCase().includes(searchTerm)
    );
  };

  const handleOriginStationChange = (newValue: Station | null) => {
    if (newValue && originStation && newValue.id === originStation.id) {
      dispatch(setOriginStation(null));
      setError(null);
      return;
    }
    
    if (newValue && destinationStation && newValue.id === destinationStation.id) {
      setError(t('destination.validation.sameStation'));
      return;
    }
    dispatch(setOriginStation(newValue));
    setError(null);
  };

  const handleDestinationStationChange = (newValue: Station | null) => {
    if (newValue && destinationStation && newValue.id === destinationStation.id) {
      dispatch(setDestinationStation(null));
      setError(null);
      return;
    }
    
    if (newValue && originStation && newValue.id === originStation.id) {
      setError(t('destination.validation.sameStation'));
      return;
    }
    dispatch(setDestinationStation(newValue));
    setError(null);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as 'all' | 'morning' | 'afternoon' | 'evening' | 'night';
    setSelectedTimeRange(value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedFilters(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const timeRangeOptions = [
    { value: 'all', label: t('dateTimeSelection.timeRange.all'), icon: <AccessTimeIcon /> },
    { value: 'morning', label: t('dateTimeSelection.timeRange.morning'), icon: <WbSunnyIcon /> },
    { value: 'afternoon', label: t('dateTimeSelection.timeRange.afternoon'), icon: <WbTwilightIcon /> },
    { value: 'evening', label: t('dateTimeSelection.timeRange.evening'), icon: <NightsStayIcon /> },
    { value: 'night', label: t('dateTimeSelection.timeRange.night'), icon: <DarkModeIcon /> },
  ];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

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
          }}
        >
          <IconButton
            onClick={handleBack}
            color="primary"
            aria-label={t('ticketSelection.destination.back')}
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
            {t('ticketSelection.destination.step', { current: currentStep, total: totalSteps })}
          </Typography>

          <IconButton
            onClick={handleCancel}
            color="primary"
            aria-label={t('ticketSelection.destination.cancel')}
            sx={{ ml: 2 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

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
          {t('ticketSelection.destination.title')}
        </Typography>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 4, mb: 2 }}>
          {/* Station Selection Row */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' }, 
            gap: 2,
            alignItems: 'center'
          }}>
            {/* Origin Station */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: `${fontSize * 1.2}px`,
                  color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
                }}
              >
                {t('ticketSelection.destination.from')}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Autocomplete
                  value={originStation}
                  onChange={(_, newValue) => handleOriginStationChange(newValue)}
                  options={popularStations.filter(station => !destinationStation || station.id !== destinationStation.id)}
                  getOptionLabel={getStationLabel}
                  filterOptions={filterStations}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('ticketSelection.destination.searchPlaceholder')}
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!error && error === t('destination.validation.sameStation')}
                      helperText={error === t('destination.validation.sameStation') ? error : ''}
                      InputLabelProps={{
                        className: '',
                        shrink: true,
                        focused: false,
                        error: false,
                        disabled: false,
                        required: false,
                        variant: 'outlined',
                        color: 'primary',
                        margin: 'dense',
                        size: 'small'
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: `${fontSize}px`,
                        },
                      }}
                    />
                  )}
                  sx={{ flexGrow: 1 }}
                />
                
                <IconButton
                  onClick={handleUseLocation}
                  color={useCurrentLocation ? 'primary' : 'default'}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  title={t('ticketSelection.destination.useLocation')}
                >
                  <LocationOnIcon />
                </IconButton>
              </Box>

              <Paper
                sx={{
                  p: 2,
                  mt: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  backgroundColor: isHighContrast ? theme.palette.primary.main : 'background.paper',
                }}
              >
                {popularStations.slice(0, 5).map((station) => (
                  <StationChip
                    key={station.id}
                    label={getStationLabel(station)}
                    onClick={() => handleOriginStationChange(station)}
                    color={originStation?.id === station.id ? 'primary' : 'default'}
                    disabled={destinationStation?.id === station.id}
                    sx={{
                      fontSize: `${fontSize * 0.9}px`,
                      backgroundColor: isHighContrast ? theme.palette.primary.dark : undefined,
                    }}
                  />
                ))}
              </Paper>
            </Box>

            {/* Swap Button */}
            <IconButton
              onClick={handleSwapStations}
              color="primary"
              sx={{
                border: 1,
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                alignSelf: 'center',
                mt: { xs: 0, md: 4 }
              }}
            >
              <SwapHorizIcon />
            </IconButton>

            {/* Destination Station */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: `${fontSize * 1.2}px`,
                  color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
                }}
              >
                {t('ticketSelection.destination.to')}
              </Typography>
              
              <Autocomplete
                value={destinationStation}
                onChange={(_, newValue) => handleDestinationStationChange(newValue)}
                options={popularStations.filter(station => !originStation || station.id !== originStation.id)}
                getOptionLabel={getStationLabel}
                filterOptions={filterStations}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('ticketSelection.destination.searchPlaceholder')}
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={!!error && error === t('destination.validation.sameStation')}
                    helperText={error === t('destination.validation.sameStation') ? error : ''}
                    InputLabelProps={{
                      className: '',
                      shrink: true,
                      focused: false,
                      error: false,
                      disabled: false,
                      required: false,
                      variant: 'outlined',
                      color: 'primary',
                      margin: 'dense',
                      size: 'small'
                    }}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: `${fontSize}px`,
                      },
                    }}
                  />
                )}
              />

              <Paper
                sx={{
                  p: 2,
                  mt: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  backgroundColor: isHighContrast ? theme.palette.primary.main : 'background.paper',
                }}
              >
                {popularStations.slice(0, 5).map((station) => (
                  <StationChip
                    key={station.id}
                    label={getStationLabel(station)}
                    onClick={() => handleDestinationStationChange(station)}
                    color={destinationStation?.id === station.id ? 'primary' : 'default'}
                    disabled={originStation?.id === station.id}
                    sx={{
                      fontSize: `${fontSize * 0.9}px`,
                      backgroundColor: isHighContrast ? theme.palette.primary.dark : undefined,
                    }}
                  />
                ))}
              </Paper>
            </Box>
          </Box>

          {/* Date and Time Selection Row */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 3 
          }}>
            {/* Date Selection */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: `${fontSize * 1.2}px`,
                  color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
                }}
              >
                {t('dateTimeSelection.date.label')}
              </Typography>
              
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  maxDate={maxDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      sx: {
                        '& .MuiInputBase-input': {
                          fontSize: `${fontSize}px`,
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            {/* Time Range Selection */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: `${fontSize * 1.2}px`,
                  color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
                }}
              >
                {t('dateTimeSelection.timeRange.label')}
              </Typography>

              <RadioGroup
                value={selectedTimeRange}
                onChange={handleTimeRangeChange}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 0.5,
                  flexWrap: 'nowrap',
                  justifyContent: 'space-between',
                  '& .MuiFormControlLabel-root': {
                    margin: 0,
                    flex: '1 1 0',
                  }
                }}
              >
                {timeRangeOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <TimeRangeButton
                        elevation={1}
                        sx={{
                          backgroundColor: selectedTimeRange === option.value ? 'primary.main' : 'background.paper',
                          color: selectedTimeRange === option.value ? 'primary.contrastText' : 'inherit',
                          padding: { xs: 0.5, sm: 1 },
                          '& .MuiSvgIcon-root': {
                            fontSize: { xs: '1rem', sm: '1.2rem' }
                          }
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          justifyContent: 'center',
                          width: '100%'
                        }}>
                          {option.icon}
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: `${fontSize * 0.8}px`,
                              whiteSpace: 'nowrap',
                              lineHeight: 1,
                            }}
                          >
                            {option.label}
                          </Typography>
                        </Box>
                      </TimeRangeButton>
                    }
                  />
                ))}
              </RadioGroup>
            </Box>
          </Box>

          {/* Filters Section */}
          <FilterSection>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1,
              '& .MuiFormControlLabel-root': {
                margin: 0,
                padding: 0.5,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiCheckbox-root': {
                  padding: 0.5,
                },
                '& .MuiTypography-root': {
                  fontSize: `${fontSize * 0.9}px`,
                  lineHeight: 1.2,
                }
              }
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFilters.fastTrainsOnly}
                    onChange={handleFilterChange}
                    name="fastTrainsOnly"
                    size="small"
                  />
                }
                label={i18n.language === 'bg' ? 'Бързи влакове' : 'Fast Trains'}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFilters.directTrainsOnly}
                    onChange={handleFilterChange}
                    name="directTrainsOnly"
                    size="small"
                  />
                }
                label={i18n.language === 'bg' ? 'Директни влакове' : 'Direct Trains'}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFilters.sleepingCarsOnly}
                    onChange={handleFilterChange}
                    name="sleepingCarsOnly"
                    size="small"
                  />
                }
                label={i18n.language === 'bg' ? 'Спални вагони' : 'Sleeping Carriages'}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFilters.firstClassOnly}
                    onChange={handleFilterChange}
                    name="firstClassOnly"
                    size="small"
                  />
                }
                label={i18n.language === 'bg' ? 'Първа класа' : 'First Class'}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFilters.accessibleCarsOnly}
                    onChange={handleFilterChange}
                    name="accessibleCarsOnly"
                    size="small"
                  />
                }
                label={i18n.language === 'bg' ? 'Вагони за трудноподвижни' : 'Accessible Carriages'}
                sx={{ gridColumn: '1 / -1' }}
              />
            </Box>
          </FilterSection>

          {/* Continue Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleContinue}
              size="large"
              disabled={!originStation || !destinationStation || !selectedDate}
              sx={{
                minWidth: 200,
                fontSize: `${fontSize}px`,
                py: 1.5,
              }}
            >
              {t('ticketSelection.destination.continue')}
            </Button>
          </Box>
        </Box>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            sx={{
              width: '100%',
              fontSize: `${fontSize}px`,
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Fade>
  );
};

export default TicketSearch; 