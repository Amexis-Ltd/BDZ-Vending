import React, { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPassengerCount, selectCurrentTicket, startNewTicket } from '../../store/features/ticket/ticketSlice';

export const PassengerCountStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTicket = useAppSelector(selectCurrentTicket);
  
  // Initialize ticket if needed
  React.useEffect(() => {
    if (!currentTicket) {
      dispatch(startNewTicket());
    }
  }, [currentTicket, dispatch]);
  
  // Local state for better UI control
  const [count, setCount] = useState<number>(currentTicket?.passengerCount || 1);
  
  // Handle count change from input field
  const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Parse to number, default to 1 if invalid
    const newCount = parseInt(event.target.value) || 1;
    
    // Constrain to valid range
    const validCount = Math.max(1, Math.min(8, newCount));
    
    // Update local state
    setCount(validCount);
    
    // Dispatch to Redux store
    dispatch(setPassengerCount(validCount));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Брой пътници
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Изберете броя пътници (максимум 8)
      </Typography>
      
      <TextField
        label="Брой пътници"
        type="number"
        value={count}
        onChange={handleCountChange}
        inputProps={{ 
          min: 1,
          max: 8,
          step: 1,
          style: { 
            fontSize: '1.5rem', 
            padding: '12px',
            textAlign: 'center',
            fontWeight: '500'
          }
        }}
        InputLabelProps={{
          shrink: true,
          style: { fontSize: '1.1rem' }
        }}
        variant="outlined"
        size="medium"
        fullWidth
        sx={{ 
          maxWidth: '200px',
          '& .MuiOutlinedInput-root': {
            height: 56
          }
        }}
      />
      
      {/* Optional debugging info */}
      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
        Брой пътници в системата: {currentTicket?.passengerCount || '(не е зададен)'}
      </Typography>
    </Box>
  );
}; 