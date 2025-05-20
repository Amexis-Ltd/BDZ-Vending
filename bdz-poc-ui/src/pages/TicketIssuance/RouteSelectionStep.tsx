import React, { useState } from 'react';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { bg } from 'date-fns/locale';
import { useAppDispatch } from '../../store/hooks';
import { setRouteSelection, RouteSelectionPayload } from '../../store/features/ticket/ticketSlice';

// Mock data for demonstration
const STATIONS = [
  'София',
  'Пловдив',
  'Варна',
  'Бургас',
  'Русе',
  'Стара Загора',
  'Плевен',
];

// Add this predefined time slots constant
const DEPARTURE_TIMES = [
  '06:10',
  '07:30',
  '08:45',
  '10:15',
  '11:43',
  '12:30',
  '14:20',
  '15:50',
  '17:15',
  '18:45',
  '20:30',
  '22:10'
];

interface RouteSelectionStepProps {
  onComplete: () => void;
}

export const RouteSelectionStep: React.FC<RouteSelectionStepProps> = ({ onComplete }) => {
  const dispatch = useAppDispatch();
  const [route, setRoute] = useState<{
    fromStation: string;
    toStation: string;
    viaStation: string | undefined;
    departureDate: Date;
    departureTime: string | undefined;
  }>({
    fromStation: '',
    toStation: '',
    viaStation: undefined,
    departureDate: new Date(),
    departureTime: undefined,
  });

  const handleSubmit = () => {
    let departureDateTime: string | undefined = undefined;
    
    if (route.departureTime && route.departureDate) {
      const dateTime = new Date(route.departureDate);
      const timeParts = route.departureTime.split(':');
      
      if (timeParts.length === 2) {
        const hoursStr = timeParts[0];
        const minutesStr = timeParts[1];
        if (hoursStr && minutesStr) {
          const hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr, 10);
          
          if (!isNaN(hours) && !isNaN(minutes)) {
            dateTime.setHours(hours, minutes, 0, 0);
            departureDateTime = dateTime.toISOString();
          }
        }
      }
    }
    
    const payload: RouteSelectionPayload = {
      fromStation: route.fromStation,
      toStation: route.toStation,
      viaStation: route.viaStation,
      departureDate: route.departureDate.toISOString(),
      departureTime: departureDateTime
    };
    dispatch(setRouteSelection(payload));
    onComplete();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
      <Grid container sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
        {/* First row */}
        <Grid>
          <FormControl fullWidth size="medium" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ fontSize: '1.1rem' }}>Начална гара</InputLabel>
            <Select
              value={route.fromStation}
              onChange={(e) => setRoute({ ...route, fromStation: e.target.value })}
              label="Начална гара"
              sx={{ fontSize: '1.1rem', height: 56 }}
            >
              <MenuItem value="" disabled>
                <em>Изберете гара</em>
              </MenuItem>
              {STATIONS.map((station) => (
                <MenuItem key={station} value={station} sx={{ fontSize: '1.1rem' }}>
                  {station}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid>
          <FormControl fullWidth size="medium" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ fontSize: '1.1rem' }}>Крайна гара</InputLabel>
            <Select
              value={route.toStation}
              onChange={(e) => setRoute({ ...route, toStation: e.target.value })}
              label="Крайна гара"
              sx={{ fontSize: '1.1rem', height: 56 }}
            >
              <MenuItem value="" disabled>
                <em>Изберете гара</em>
              </MenuItem>
              {STATIONS.map((station) => (
                <MenuItem key={station} value={station} sx={{ fontSize: '1.1rem' }}>
                  {station}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Second row */}
        <Grid>
          <DatePicker
            label="Дата на заминаване"
            value={route.departureDate}
            onChange={(newValue) => setRoute({ ...route, departureDate: newValue || new Date() })}
            sx={{ 
              width: '100%', 
              '& .MuiOutlinedInput-root': { 
                height: 56, 
                fontSize: '1.1rem' 
              },
              '& .MuiInputLabel-root': {
                fontSize: '1.1rem'
              }
            }}
            minDate={new Date()}
          />
        </Grid>
        
        <Grid>
          <FormControl fullWidth size="medium" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ fontSize: '1.1rem' }}>Час на заминаване</InputLabel>
            <Select
              value={route.departureTime ?? ''}
              onChange={(e) => setRoute({ ...route, departureTime: e.target.value || undefined })}
              label="Час на заминаване"
              sx={{ fontSize: '1.1rem', height: 56 }}
            >
              <MenuItem value="" sx={{ fontSize: '1.1rem' }}>
                <em>Без конкретен час</em>
              </MenuItem>
              {DEPARTURE_TIMES.map((time) => (
                <MenuItem key={time} value={time} sx={{ fontSize: '1.1rem' }}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Button row spanning both columns */}
        <Grid sx={{ gridColumn: '1 / span 2' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={!route.fromStation || !route.toStation}
              size="large"
              sx={{ fontSize: '1rem', py: 1.5, px: 4 }}
            >
              Потвърди маршрут
            </Button>
          </Box>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}; 