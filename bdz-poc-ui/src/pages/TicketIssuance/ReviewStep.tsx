import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentTicket } from '../../store/features/ticket/ticketSlice';

interface ReviewStepProps {
  // No onComplete needed here, the main component handles finish
}

export const ReviewStep: React.FC<ReviewStepProps> = () => {
  const currentTicket = useAppSelector(selectCurrentTicket);

  if (!currentTicket) {
    return <Typography>Грешка: Липсват данни за билета.</Typography>;
  }

  // Helper to format time from ISO string
  const formatTime = (isoString: string | undefined) => {
    if (!isoString) return 'Не е избран';
    try {
      return new Date(isoString).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Не е избран';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Преглед и потвърждение
      </Typography>
      <List disablePadding>
        <ListItem>
          <ListItemText primary="Маршрут" secondary={`${currentTicket.route?.fromStation || '?'} - ${currentTicket.route?.toStation || '?'}`} />
        </ListItem>
        <ListItem>
          <ListItemText
             primary="Дата и час"
             // Combine date and time
             secondary={`${currentTicket.route?.departureDate ? new Date(currentTicket.route.departureDate).toLocaleDateString('bg-BG') : '?'} ${formatTime(currentTicket.route?.departureTime)}`}
           />
        </ListItem>
        {/* Remove Time Slot display
        {currentTicket.route?.departureTimeSlot && (
          <ListItem>
            <ListItemText primary="Времеви слот" secondary={currentTicket.route.departureTimeSlot} />
          </ListItem>
        )} */}
         <ListItem>
          <ListItemText primary="Тип връщане" secondary={currentTicket.returnType === 'one-way' ? 'Еднопосочен' : currentTicket.returnType === 'round-trip-open' ? 'Двупосочен отворен' : 'Двупосочен с дата'} />
        </ListItem>
         {currentTicket.returnType === 'round-trip-fixed' && currentTicket.returnDate && (
          <>
            <ListItem>
              <ListItemText 
                primary="Дата на връщане" 
                secondary={new Date(currentTicket.returnDate).toLocaleDateString('bg-BG')} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Час на връщане" 
                secondary={formatTime(currentTicket.returnDate)} 
              />
            </ListItem>
          </>
        )}
        <ListItem>
          <ListItemText primary="Брой пътници" secondary={currentTicket.passengerCount} />
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle1" sx={{ mt: 1 }}>Пътници:</Typography>
        {currentTicket.passengers.map((passenger, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Пътник ${index + 1}`}
              secondary={`Намаление: ${passenger.discount || 'Няма'}, Вагон: ${passenger.carNumber || 'Не е избран'}, Място: ${passenger.seatNumber || 'Автоматично'}`}
            />
          </ListItem>
        ))}
      </List>
      {/* The "Издаване на билет" button is handled by the main component */}
    </Box>
  );
}; 