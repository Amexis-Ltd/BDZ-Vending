import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  FormLabel,
  Chip,
  Stack,
  Autocomplete,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { bg } from 'date-fns/locale/bg';
import { styled } from '@mui/material/styles';

// Icons (Include all needed)
import ScheduleIcon from '@mui/icons-material/Schedule';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrainIcon from '@mui/icons-material/Train';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ChairIcon from '@mui/icons-material/Chair';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsRailwayIcon from '@mui/icons-material/DirectionsRailway';

// --- Type Definitions ---
interface TrainClass {
  type: 'first' | 'second';
  available: boolean;
  price?: number;
}

interface TrainStop {
  station: string;
  arrivalTime?: string;
  departureTime?: string;
}

interface ScheduleResult {
    id: string;
    trainNumber: string;
    fromStation: string;
    toStation: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    transfers: string;
    transferDetails?: string;
    classes: TrainClass[];
}

// --- Styled Components (Based on last HTML) ---
const SearchFormCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2, 3),
}));

const FilterSortControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

const TimetableResultsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  marginBottom: theme.spacing(3), // Add margin bottom
}));

const TimetableEntry = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
   [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      textAlign: 'center',
      gap: theme.spacing(1.5),
   }
}));

const TrainInfo = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
    color: theme.palette.primary.main,
    display: 'block',
    margin: '0 auto 0.25rem auto',
  },
  '& span': {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '0.9rem',
  },
}));

const RouteDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
  }
}));

const TimeStation = styled(Box)(({ theme }) => ({
  fontSize: '1.1rem',
  textAlign: 'center',
  '& strong': {
    display: 'block',
    fontSize: '1.2rem',
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const DurationTransfers = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  '& > span': { // Target direct span children
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing(0.5),
       '& .MuiSvgIcon-root': {
         marginRight: theme.spacing(0.5),
         fontSize: '1.1em',
      },
  },
}));

const Actions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  alignItems: 'flex-end',
   [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      flexWrap: 'wrap', // Allow wrapping
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(1),
      gap: theme.spacing(1), // Add gap for horizontal layout
   }
}));

const ClassInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  '& .MuiChip-root': {
    height: '24px',
    '& .MuiChip-label': {
      padding: '0 8px',
      fontSize: '0.75rem',
    },
    '& .MuiChip-icon': {
      fontSize: '0.9rem',
      marginLeft: '4px',
      marginRight: '-4px',
    }
  }
}));

// --- Dummy Data ---
const allScheduleResults: ScheduleResult[] = [
  {
    id: 'res1',
    trainNumber: 'БВ 8631',
    fromStation: 'София',
    toStation: 'Варна',
    departureTime: '10:15',
    arrivalTime: '17:50',
    duration: '7ч 35м',
    transfers: 'Директен',
    classes: [
      { type: 'first', available: true, price: 45.50 },
      { type: 'second', available: true, price: 32.80 }
    ]
  },
  {
    id: 'res2',
    trainNumber: 'БВ 2613',
    fromStation: 'София',
    toStation: 'Бургас',
    departureTime: '13:00',
    arrivalTime: '19:10',
    duration: '6ч 10м',
    transfers: '1 прекачване',
    transferDetails: 'Карлово',
    classes: [
      { type: 'first', available: true, price: 42.30 },
      { type: 'second', available: true, price: 30.50 }
    ]
  },
  {
    id: 'res3',
    trainNumber: 'ПВ 10115',
    fromStation: 'София',
    toStation: 'Пловдив',
    departureTime: '14:45',
    arrivalTime: '17:50',
    duration: '3ч 05м',
    transfers: 'Директен',
    classes: [
      { type: 'first', available: false },
      { type: 'second', available: true, price: 18.90 }
    ]
  },
  {
    id: 'res4',
    trainNumber: 'БВ 8645',
    fromStation: 'София',
    toStation: 'Варна',
    departureTime: '08:30',
    arrivalTime: '16:05',
    duration: '7ч 35м',
    transfers: 'Директен',
    classes: [
      { type: 'first', available: true, price: 45.50 },
      { type: 'second', available: true, price: 32.80 }
    ]
  },
  {
    id: 'res5',
    trainNumber: 'КПВ 1234',
    fromStation: 'София',
    toStation: 'Пловдив',
    departureTime: '16:20',
    arrivalTime: '19:45',
    duration: '3ч 25м',
    transfers: 'Директен',
    classes: [
      { type: 'first', available: false },
      { type: 'second', available: true, price: 15.90 }
    ]
  },
  {
    id: 'res6',
    trainNumber: 'БВ 2615',
    fromStation: 'София',
    toStation: 'Бургас',
    departureTime: '09:15',
    arrivalTime: '15:25',
    duration: '6ч 10м',
    transfers: '1 прекачване',
    transferDetails: 'Карлово',
    classes: [
      { type: 'first', available: true, price: 42.30 },
      { type: 'second', available: true, price: 30.50 }
    ]
  },
  {
    id: 'res7',
    trainNumber: 'ПВ 10117',
    fromStation: 'София',
    toStation: 'Пловдив',
    departureTime: '18:30',
    arrivalTime: '21:35',
    duration: '3ч 05м',
    transfers: 'Директен',
    classes: [
      { type: 'first', available: true, price: 22.90 },
      { type: 'second', available: true, price: 18.90 }
    ]
  },
  {
    id: 'res8',
    trainNumber: 'БВ 8633',
    fromStation: 'София',
    toStation: 'Варна',
    departureTime: '15:45',
    arrivalTime: '23:20',
    duration: '7ч 35м',
    transfers: '1 прекачване',
    transferDetails: 'Търговище',
    classes: [
      { type: 'first', available: true, price: 43.50 },
      { type: 'second', available: true, price: 31.80 }
    ]
  }
];

// Add stations data
const stations = [
  'София',
  'Варна',
  'Бургас',
  'Пловдив',
  'Русе',
  'Стара Загора',
  'Плевен',
  'Сливен',
  'Шумен',
  'Добрич',
  'Враца',
  'Габрово',
  'Ямбол',
  'Хасково',
  'Перник',
  'Благоевград',
  'Кюстендил',
  'Ловеч',
  'Търговище',
  'Разград',
  'Силистра',
  'Монтана',
  'Видин',
  'Велико Търново',
  'Карлово',
  'Казанлък',
  'Септември',
  'Ихтиман',
  'Костелево',
  'Пазарджик',
  'Нова Загора',
  'Горна Оряховица',
  'Мездра',
  'Дупница',
  'Сандански',
  'Петрич',
  'Свищов',
  'Лом',
  'Берковица',
  'Троян',
].sort();

// --- SchedulePage Component ---
const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // Form State
  const [fromStation, setFromStation] = useState<string>('София');
  const [toStation, setToStation] = useState<string>('Варна');
  const [dateValue, setDateValue] = useState<Date | null>(new Date());
  const [timeValue, setTimeValue] = useState<Date | null>(null);
  const [timeType, setTimeType] = useState('departure');
  const [sortBy, setSortBy] = useState('departureTime');
  const [showDirectOnly, setShowDirectOnly] = useState(false);
  const [trainType, setTrainType] = useState('all');

  // Results State - Initialize as empty array
  const [results, setResults] = useState<ScheduleResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // --- Handlers ---
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSearched(true);
    
    // Filter results based on search criteria
    let filteredResults = allScheduleResults.filter(result => {
      const matchesFrom = result.fromStation.toLowerCase().includes(fromStation.toLowerCase());
      const matchesTo = result.toStation.toLowerCase().includes(toStation.toLowerCase());
      const matchesDirectOnly = !showDirectOnly || result.transfers === 'Директен';
      const matchesTrainType = trainType === 'all' || 
        (trainType === 'fast' && result.trainNumber.startsWith('БВ')) ||
        (trainType === 'passenger' && result.trainNumber.startsWith('ПВ')) ||
        (trainType === 'suburban' && result.trainNumber.startsWith('КПВ'));

      return matchesFrom && matchesTo && matchesDirectOnly && matchesTrainType;
    });

    // Sort results
    filteredResults.sort((a, b) => {
      switch (sortBy) {
        case 'departureTime':
          return a.departureTime.localeCompare(b.departureTime);
        case 'arrivalTime':
          return a.arrivalTime.localeCompare(b.arrivalTime);
        case 'duration':
          return a.duration.localeCompare(b.duration);
        default:
          return 0;
      }
    });

    setResults(filteredResults);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value);
    handleSearchSubmit(new Event('submit') as any);
  };

  const handleTrainTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrainType(event.target.value);
    handleSearchSubmit(new Event('submit') as any);
  };

  const handleDirectOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowDirectOnly(event.target.checked);
    handleSearchSubmit(new Event('submit') as any);
  };

  const handleTimeTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeType((event.target as HTMLInputElement).value);
  };

  const handleApplyFilters = () => {
    console.log('Apply filters clicked - (Not implemented)');
    // In real app: refetch or filter existing results state
  };

  const handleBuyTicket = (result: ScheduleResult) => {
    // Do nothing when buy ticket button is clicked
    console.log('Buy ticket button clicked but no action taken');
  };

  const handleShowDetails = (resultId: string) => {
    console.log('SchedulePage - handleShowDetails called with resultId:', resultId);
    const trainDetails = results.find(r => r.id === resultId);
    console.log('SchedulePage - Found train details:', trainDetails);
    
    if (trainDetails) {
      // Define different route variations based on destination
      let stops: TrainStop[] = [];
      
      if (trainDetails.toStation === 'Пловдив') {
        // Direct route to Plovdiv - different variations based on train type
        if (trainDetails.trainNumber.startsWith('БВ')) {
          // Fast train route
          stops = [
            { station: trainDetails.fromStation, departureTime: trainDetails.departureTime },
            { station: 'Ихтиман', arrivalTime: '14:15', departureTime: '14:17' },
            { station: 'Костелево', arrivalTime: '14:45', departureTime: '14:47' },
            { station: 'Септември', arrivalTime: '15:30', departureTime: '15:32' },
            { station: 'Пазарджик', arrivalTime: '16:15', departureTime: '16:17' },
            { station: trainDetails.toStation, arrivalTime: trainDetails.arrivalTime }
          ];
        } else if (trainDetails.trainNumber.startsWith('ПВ')) {
          // Passenger train route
          stops = [
            { station: trainDetails.fromStation, departureTime: trainDetails.departureTime },
            { station: 'Ихтиман', arrivalTime: '15:20', departureTime: '15:22' },
            { station: 'Септември', arrivalTime: '16:10', departureTime: '16:12' },
            { station: 'Пазарджик', arrivalTime: '16:45', departureTime: '16:47' },
            { station: trainDetails.toStation, arrivalTime: trainDetails.arrivalTime }
          ];
        } else {
          // Suburban train route
          stops = [
            { station: trainDetails.fromStation, departureTime: trainDetails.departureTime },
            { station: 'Ихтиман', arrivalTime: '17:05', departureTime: '17:07' },
            { station: 'Септември', arrivalTime: '17:50', departureTime: '17:52' },
            { station: trainDetails.toStation, arrivalTime: trainDetails.arrivalTime }
          ];
        }
      } else if (trainDetails.toStation === 'Варна') {
        // Route to Varna with two variations
        if (trainDetails.transfers === 'Директен') {
          stops = [
            { station: trainDetails.fromStation, departureTime: trainDetails.departureTime },
            { station: 'Стара Загора', arrivalTime: '13:45', departureTime: '13:50' },
            { station: 'Сливен', arrivalTime: '14:30', departureTime: '14:35' },
            { station: 'Шумен', arrivalTime: '16:45', departureTime: '16:50' },
            { station: trainDetails.toStation, arrivalTime: trainDetails.arrivalTime }
          ];
        } else {
          // Route with transfer
          stops = [
            { station: trainDetails.fromStation, departureTime: trainDetails.departureTime },
            { station: 'Стара Загора', arrivalTime: '13:45', departureTime: '13:50' },
            { station: 'Търговище', arrivalTime: '15:20', departureTime: '15:25' },
            { station: trainDetails.toStation, arrivalTime: trainDetails.arrivalTime }
          ];
        }
      } else if (trainDetails.toStation === 'Бургас') {
        // Route to Burgas with two variations
        if (trainDetails.transfers === 'Директен') {
          stops = [
            { station: trainDetails.fromStation, departureTime: trainDetails.departureTime },
            { station: 'Карлово', arrivalTime: '13:15', departureTime: '13:20' },
            { station: 'Казанлък', arrivalTime: '14:00', departureTime: '14:05' },
            { station: 'Нова Загора', arrivalTime: '15:30', departureTime: '15:35' },
            { station: trainDetails.toStation, arrivalTime: trainDetails.arrivalTime }
          ];
        } else {
          // Route with transfer in Karlovo
          stops = [
            { station: trainDetails.fromStation, departureTime: trainDetails.departureTime },
            { station: 'Карлово', arrivalTime: '13:15', departureTime: '13:20' },
            { station: trainDetails.toStation, arrivalTime: trainDetails.arrivalTime }
          ];
        }
      }

      // Add stops data and amenities to the train details
      const trainDetailsWithStops = {
        ...trainDetails,
        stops,
        amenities: {
          wifi: true,
          restaurant: trainDetails.trainNumber.startsWith('БВ'),
          airConditioning: true,
          accessible: true,
          luggageSpace: true,
          petsAllowed: trainDetails.trainNumber.startsWith('БВ'),
          smokingArea: false,
          powerOutlets: true
        },
        platform: trainDetails.trainNumber.startsWith('БВ') ? '1' : '2',
        track: trainDetails.trainNumber.startsWith('БВ') ? '2' : '3'
      };
      console.log('SchedulePage - Navigating to train-details with data:', trainDetailsWithStops);
      navigate('/train-details', { state: { trainDetails: trainDetailsWithStops } });
    } else {
      console.log('SchedulePage - No train details found for resultId:', resultId);
    }
  };

  // Helper function to render class chips
  const renderClassChips = (result: ScheduleResult) => {
    const availableClasses = result.classes.filter(trainClass => trainClass.available);
    
    if (availableClasses.length === 0) {
      return null;
    }

    return (
      <ClassInfo>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          Класове:
        </Typography>
        <Stack direction="row" spacing={0.5} useFlexGap>
          {availableClasses.map((trainClass) => (
            <Chip
              key={trainClass.type}
              icon={trainClass.type === 'first' ? <BusinessIcon /> : <ChairIcon />}
              label={`${trainClass.type === 'first' ? 'I' : 'II'}${trainClass.price ? ` ${trainClass.price.toFixed(2)}лв` : ''}`}
              variant="outlined"
              size="small"
              sx={{ 
                backgroundColor: 'background.paper',
                '& .MuiChip-icon': {
                  color: 'primary.main'
                }
              }}
            />
          ))}
        </Stack>
      </ClassInfo>
    );
  };

  // --- Rendering ---
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ScheduleIcon fontSize="inherit" sx={{ mr: 1 }} /> Разписания
      </Typography>

      {/* Search Form */}
      <SearchFormCard variant="outlined">
        <Box component="form" onSubmit={handleSearchSubmit}>
             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
                 <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '150px' } }}> 
                     <Autocomplete
                       disablePortal
                       id="from-station"
                       options={stations}
                       value={fromStation}
                       onChange={(_, newValue) => setFromStation(newValue || '')}
                       renderInput={(params) => (
                         <TextField
                           {...params}
                           variant="outlined"
                           label="От"
                           size="small"
                           required
                           fullWidth
                           disabled={isLoading}
                           inputProps={{
                             ...params.inputProps,
                             'aria-label': 'Начална гара'
                           }}
                           InputLabelProps={{
                             className: '',
                             shrink: true,
                             focused: false,
                             error: false,
                             disabled: isLoading,
                             required: true,
                             variant: 'outlined',
                             color: 'primary',
                             margin: 'dense',
                             size: 'small'
                           }}
                         />
                       )}
                       sx={{ width: '100%' }}
                       getOptionLabel={(option) => option}
                       isOptionEqualToValue={(option, value) => option === value}
                       noOptionsText="Няма намерени гари"
                       loadingText="Зареждане..."
                     />
                 </Box>
                 <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '150px' } }}>
                     <Autocomplete
                       disablePortal
                       id="to-station"
                       options={stations}
                       value={toStation}
                       onChange={(_, newValue) => setToStation(newValue || '')}
                       renderInput={(params) => (
                         <TextField
                           {...params}
                           variant="outlined"
                           label="До"
                           size="small"
                           required
                           fullWidth
                           disabled={isLoading}
                           inputProps={{
                             ...params.inputProps,
                             'aria-label': 'Крайна гара'
                           }}
                           InputLabelProps={{
                             className: '',
                             shrink: true,
                             focused: false,
                             error: false,
                             disabled: isLoading,
                             required: true,
                             variant: 'outlined',
                             color: 'primary',
                             margin: 'dense',
                             size: 'small'
                           }}
                         />
                       )}
                       sx={{ width: '100%' }}
                       getOptionLabel={(option) => option}
                       isOptionEqualToValue={(option, value) => option === value}
                       noOptionsText="Няма намерени гари"
                       loadingText="Зареждане..."
                     />
                 </Box>
                 <Box sx={{ width: { xs: 'calc(50% - 8px)', md: 'auto' }, minWidth: { md: 150 } }}>
                     <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
                         <DatePicker
                             label="Дата"
                             value={dateValue}
                             onChange={setDateValue}
                             slotProps={{ textField: { fullWidth: true, variant: 'outlined', required: true } }}
                         />
                     </LocalizationProvider>
                 </Box>
                 <Box sx={{ width: { xs: 'calc(50% - 8px)', md: 'auto' }, minWidth: { md: 150 } }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
                        <TimePicker
                            label="Час"
                            value={timeValue}
                            onChange={setTimeValue}
                            slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                            ampm={false}
                        />
                    </LocalizationProvider>
                 </Box>
                 <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                     <Button fullWidth type="submit" variant="contained" size="large" startIcon={<SearchIcon />} sx={{ height: '56px' }}>
                         Търсене
                     </Button>
                 </Box>
             </Box>
             {/* Time Type Radio Buttons - Placed below the flex container */}
             <FormControl component="fieldset" sx={{ mt: 2 }}> 
               <FormLabel component="legend" sx={{ fontSize: '0.9rem', mb: 0.5 }}>Посоченият час е за:</FormLabel>
                <RadioGroup row name="timeType" value={timeType} onChange={handleTimeTypeChange}> 
                  <FormControlLabel value="departure" control={<Radio size="small" />} label="Заминаване" />
                  <FormControlLabel value="arrival" control={<Radio size="small" />} label="Пристигане" />
                </RadioGroup>
              </FormControl>
         </Box>
      </SearchFormCard>

      {/* Filter and Sort Controls - Only show after search */}
      {hasSearched && (
        <FilterSortControls>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Сортирай по</InputLabel>
            <Select 
              label="Сортирай по" 
              value={sortBy}
              onChange={(e) => handleSortChange(e as React.ChangeEvent<HTMLInputElement>)}
            >
              <MenuItem value="departureTime">Час на заминаване</MenuItem>
              <MenuItem value="arrivalTime">Час на пристигане</MenuItem>
              <MenuItem value="duration">Продължителност</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel 
            control={
              <Checkbox 
                size="small" 
                checked={showDirectOnly}
                onChange={handleDirectOnlyChange}
              />
            } 
            label="Само директни" 
            sx={{ mr: 2 }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Тип влак</InputLabel>
            <Select 
              label="Тип влак" 
              value={trainType}
              onChange={(e) => handleTrainTypeChange(e as React.ChangeEvent<HTMLInputElement>)}
            >
              <MenuItem value="all">Всички</MenuItem>
              <MenuItem value="fast">Бърз влак (БВ)</MenuItem>
              <MenuItem value="passenger">Пътнически (ПВ)</MenuItem>
              <MenuItem value="suburban">Крайградски (КПВ)</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" size="small" startIcon={<FilterListIcon />} onClick={handleApplyFilters}>
              Приложи
          </Button>
        </FilterSortControls>
      )}

      {/* Results Area - Only show after search */}
      {hasSearched && (
        <TimetableResultsCard variant="outlined">
          <Typography variant="h6" component="h2" sx={{ px: 3, pt: 1, mb: 1 }}>
            {results.length > 0 
              ? `Намерени влакове (${results.length})`
              : 'Няма намерени влакове за избраните критерии.'}
          </Typography>
          {results.length > 0 && results.map((result) => (
            <TimetableEntry key={result.id}>
              <TrainInfo>
                <TrainIcon />
                <span>{result.trainNumber}</span>
              </TrainInfo>

              <RouteDetails>
                 <TimeStation>
                    <strong>{result.departureTime}</strong>
                    <span>{result.fromStation}</span>
                 </TimeStation>
                 <DurationTransfers>
                    <span><AccessTimeIcon /> {result.duration}</span>
                    <span><SwapHorizIcon /> {result.transfers}{result.transferDetails ? ` (${result.transferDetails})` : ''}</span>
                 </DurationTransfers>
                 <TimeStation>
                    <strong>{result.arrivalTime}</strong>
                    <span>{result.toStation}</span>
                 </TimeStation>
                 {renderClassChips(result)}
              </RouteDetails>

              <Actions>
                 <Tooltip title="Детайли за влака">
                     <Button size="small" variant="text" onClick={() => handleShowDetails(result.id)} startIcon={<InfoOutlinedIcon fontSize="small"/>}>
                         Детайли
                     </Button>
                 </Tooltip>
                 <Tooltip title="Купи билет за този влак">
                     <Button 
                       size="small" 
                       variant="contained" 
                       onClick={() => handleBuyTicket(result)} 
                       startIcon={<ConfirmationNumberIcon fontSize="small"/>}
                     >
                         Купи билет
                     </Button>
                 </Tooltip>
              </Actions>
            </TimetableEntry>
          ))}
        </TimetableResultsCard>
      )}
    </Container>
  );
};

export default SchedulePage; 