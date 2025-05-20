import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updatePassenger, selectCurrentTicket, startNewTicket } from '../../store/features/ticket/ticketSlice';

// Available discount types
const DISCOUNTS = [
  'Без намаление',
  'Пенсионер',
  'Студент',
  'Дете до 7 години',
  'Дете от 7 до 10 години',
  'Многодетни майки',
  'Военноинвалид',
  'ТПЛ'
];

interface DiscountsStepProps {
  onComplete: () => void;
}

export const DiscountsStep: React.FC<DiscountsStepProps> = ({ onComplete }) => {
  const dispatch = useAppDispatch();
  const currentTicket = useAppSelector(selectCurrentTicket);
  
  // Initialize ticket if needed
  React.useEffect(() => {
    if (!currentTicket) {
      dispatch(startNewTicket());
    }
  }, [currentTicket, dispatch]);
  
  const handleDiscountChange = (index: number, value: string) => {
    if (currentTicket) {
      dispatch(updatePassenger({
        index,
        data: { discount: value }
      }));
    }
  };

  // Get number of passengers from the ticket
  const passengerCount = currentTicket?.passengerCount || 1;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Намаления
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Изберете намаления за пътниците (ако е приложимо)
      </Typography>
      
      <Grid container spacing={2}>
        {/* Generate a discount selector for each passenger */}
        {Array.from({ length: passengerCount }).map((_, index) => (
          <Grid key={index} sx={{ width: '100%', maxWidth: '50%', mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Намаление за пътник {index + 1}</InputLabel>
              <Select
                value={currentTicket?.passengers[index]?.discount || 'Без намаление'}
                onChange={(e) => handleDiscountChange(index, e.target.value)}
                label={`Намаление за пътник ${index + 1}`}
              >
                {DISCOUNTS.map((discount) => (
                  <MenuItem key={discount} value={discount}>
                    {discount}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={onComplete}
        >
          Продължи
        </Button>
      </Box>
    </Box>
  );
}; 