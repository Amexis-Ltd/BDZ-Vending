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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Alert,
  Collapse,
  Divider,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import TrainIcon from '@mui/icons-material/Train';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WifiIcon from '@mui/icons-material/Wifi';
import AccessibleIcon from '@mui/icons-material/Accessible';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SchoolIcon from '@mui/icons-material/School';
import ElderlyIcon from '@mui/icons-material/Elderly';
import { RootState } from '../../store/store';
import { setCurrentStep } from '../../store/features/tickets/ticketsSlice';

// Types for passenger categories
type PassengerCategory = 'adult' | 'child' | 'student' | 'senior';

interface PassengerCategoryInfo {
  label: string;
  icon: React.ReactNode;
  discount: number;
  requiredDocuments: string[];
  description: string;
}

interface Passenger {
  id: number;
  category: PassengerCategory;
}

const PASSENGER_CATEGORIES: Record<PassengerCategory, PassengerCategoryInfo> = {
  adult: {
    label: 'Възрастен',
    icon: <PersonIcon />,
    discount: 0,
    requiredDocuments: [],
    description: 'Пълна цена'
  },
  child: {
    label: 'Дете',
    icon: <ChildCareIcon />,
    discount: 50,
    requiredDocuments: ['Карта за отстъпка за дете'],
    description: '50% отстъпка'
  },
  student: {
    label: 'Студент',
    icon: <SchoolIcon />,
    discount: 50,
    requiredDocuments: ['Студентска карта', 'Карта за отстъпка за студент'],
    description: '50% отстъпка'
  },
  senior: {
    label: 'Пенсионер',
    icon: <ElderlyIcon />,
    discount: 50,
    requiredDocuments: ['Пенсионерска карта', 'Карта за отстъпка за пенсионер'],
    description: '50% отстъпка'
  }
};

const Step4: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { 
    currentStep, 
    totalSteps,
    ticketType,
    originStation,
    destinationStation,
    travelDate,
    timeRange,
    selectedTrain 
  } = useSelector((state: RootState) => state.tickets);
  const { fontSize, isHighContrast } = useSelector((state: RootState) => state.settings);

  // State for passenger selection
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [passengers, setPassengers] = useState<Passenger[]>([{ id: 1, category: 'adult' }]);
  const [showDocuments, setShowDocuments] = useState<boolean>(false);

  // State for category counts
  const [categoryCounts, setCategoryCounts] = useState<Record<PassengerCategory, number>>({
    adult: 1,
    child: 0,
    student: 0,
    senior: 0,
  });
  const totalPassengerCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  // Ensure we're on step 4
  useEffect(() => {
    if (currentStep !== 4) {
      dispatch(setCurrentStep(4));
    }
  }, [currentStep, dispatch]);

  const handleBack = () => {
    dispatch(setCurrentStep(3));
    navigate('/ticket/train-selection');
  };

  const handleCancel = () => {
    navigate('/menu');
  };

  const handleContinue = () => {
    // TODO: Validate passenger selections and required documents
    dispatch(setCurrentStep(5));
    navigate('/ticket/step5');
  };

  const handlePassengerCountChange = (event: SelectChangeEvent<number>) => {
    const newCount = Number(event.target.value);
    setPassengerCount(newCount);
    
    // Update passengers array
    const newPassengers = Array.from({ length: newCount }, (_, index) => {
      const existingPassenger = passengers[index];
      return existingPassenger || { id: index + 1, category: 'adult' as PassengerCategory };
    });
    setPassengers(newPassengers);
  };

  const handlePassengerCategoryChange = (passengerId: number, category: PassengerCategory) => {
    setPassengers(prev => 
      prev.map(p => p.id === passengerId ? { ...p, category } : p)
    );
  };

  const handleCategoryCountChange = (category: PassengerCategory, delta: number) => {
    setCategoryCounts(prev => {
      const next = { ...prev };
      next[category] = Math.max(0, Math.min(9, (next[category] || 0) + delta));
      // Ensure total does not exceed 8
      const total = Object.values(next).reduce((a, b) => a + b, 0);
      if (total > 8) return prev;
      return next;
    });
  };

  const calculateTotalPrice = () => {
    if (!selectedTrain) return 0;
    let total = 0;
    for (const [cat, count] of Object.entries(categoryCounts)) {
      const info = PASSENGER_CATEGORIES[cat as PassengerCategory];
      const discount = info.discount / 100;
      total += count * (selectedTrain.price * (1 - discount));
    }
    return total;
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

  const getTicketTypeLabel = (type: string | null) => {
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

  if (!selectedTrain) {
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

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" color="error">
              Моля, изберете влак от предишната стъпка
            </Typography>
          </Box>
        </Container>
      </Fade>
    );
  }

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
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, overflow: 'auto' }}>
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
            Избор на пътници
          </Typography>

          {/* Selected Train Information */}
          <Paper 
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: isHighContrast ? theme.palette.primary.main : theme.palette.background.paper,
              color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* First Row: Train Info and Price */}
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrainIcon color="primary" />
                      <Typography sx={{ fontSize: `${fontSize}px`, fontWeight: 'bold' }}>
                        {getTicketTypeLabel(ticketType)} • Влак {selectedTrain.number}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon color="primary" />
                      <Typography sx={{ fontSize: `${fontSize}px` }}>
                        {(originStation?.name || 'Начална гара') + ' → ' + (destinationStation?.name || 'Крайна гара')}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontSize: `${fontSize * 1.2}px`,
                      color: theme.palette.primary.main,
                      fontWeight: 'bold'
                    }}
                  >
                    {formatPrice(selectedTrain.price)}
                  </Typography>
                </Box>
              </Box>

              {/* Second Row: Time and Features */}
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon color="primary" />
                      <Typography sx={{ fontSize: `${fontSize}px` }}>
                        {formatDate(travelDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon color="primary" />
                      <Typography sx={{ fontSize: `${fontSize}px` }}>
                        {selectedTrain.departureTime} - {selectedTrain.arrivalTime} ({selectedTrain.duration})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Passenger Selection Section */}
          <Paper 
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: isHighContrast ? theme.palette.primary.main : theme.palette.background.paper,
              color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontSize: `${fontSize}px` }}>
              Брой пътници
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', fontSize: `${fontSize * 0.95}px` }}>
              Изберете броя пътници по категории (максимум 9)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
              {Object.entries(PASSENGER_CATEGORIES).map(([category, info], idx) => (
                <Box key={category} sx={{ width: { xs: '100%', sm: '50%' }, p: 1, boxSizing: 'border-box' }}>
                  <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {info.icon}
                        <Typography sx={{ fontSize: `${fontSize}px`, fontWeight: 'bold' }}>{info.label}</Typography>
                        {info.requiredDocuments.length > 0 && (
                          <Tooltip 
                            title={<Box>
                              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Необходими документи:</Typography>
                              {info.requiredDocuments.map((doc, i) => (
                                <Typography key={i} variant="body2">• {doc}</Typography>
                              ))}
                            </Box>}
                            arrow
                          >
                            <InfoIcon fontSize="small" sx={{ ml: 0.5, color: 'primary.main' }} />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: `${fontSize * 0.9}px`, color: 'text.secondary', mb: 1 }}>
                      {info.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleCategoryCountChange(category as PassengerCategory, -1)}
                        disabled={categoryCounts[category as PassengerCategory] === 0}
                        sx={{ minWidth: 32, px: 0 }}
                      >
                        –
                      </Button>
                      <Typography sx={{ fontSize: `${fontSize}px`, width: 24, textAlign: 'center' }}>
                        {categoryCounts[category as PassengerCategory] || 0}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleCategoryCountChange(category as PassengerCategory, 1)}
                        disabled={categoryCounts[category as PassengerCategory] === 9 || totalPassengerCount === 8}
                        sx={{ minWidth: 32, px: 0 }}
                      >
                        +
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
            <Typography align="center" sx={{ mt: 3, fontWeight: 'bold', fontSize: `${fontSize}px` }}>
              Общ брой пътници: {totalPassengerCount}
            </Typography>
          </Paper>

          {/* Total Price */}
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: 'background.default', 
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="subtitle1" sx={{ fontSize: `${fontSize}px` }}>
              Обща цена:
            </Typography>
            <Typography variant="h6" sx={{ 
              fontSize: `${fontSize * 1.1}px`,
              color: theme.palette.primary.main,
              fontWeight: 'bold'
            }}>
              {formatPrice(calculateTotalPrice())}
            </Typography>
          </Box>

          {/* Continue Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleContinue}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: `${fontSize}px`,
            }}
          >
            Продължи
          </Button>
        </Box>
      </Container>
    </Fade>
  );
};

export default Step4; 