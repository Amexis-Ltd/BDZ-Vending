import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  issueTicket,
  selectCurrentTicket,
  startNewTicket,
} from '../store/features/ticket/ticketSlice';
import { PassengerCountStep } from './TicketIssuance/PassengerCountStep';
import { ReturnOptionsStep } from './TicketIssuance/ReturnOptionsStep';
import { DiscountsStep } from './TicketIssuance/DiscountsStep';
import { SeatSelectionStep } from './TicketIssuance/SeatSelectionStep';
import { ReviewStep } from './TicketIssuance/ReviewStep';
import { RouteSelectionStep } from './TicketIssuance/RouteSelectionStep';
import { useNavigate } from 'react-router-dom';

// Define step keys to better align with the use case UC-CashDesk-04
const steps = [
  'Избор на маршрут',
  'Опции за връщане',
  'Брой пътници',
  'Информация за пътници',
  'Избор на места',
  'Преглед и плащане',
];

const TicketIssuance: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useAppDispatch();
  const currentTicket = useAppSelector(selectCurrentTicket);
  const navigate = useNavigate();

  // Add console logs to debug the current state
  useEffect(() => {
    console.log("Current ticket state:", currentTicket);
  }, [currentTicket]);

  // Initialize ticket if none exists
  useEffect(() => {
    console.log("Checking if ticket exists:", currentTicket);
    if (!currentTicket) {
      console.log("Starting new ticket");
      dispatch(startNewTicket());
    }
  }, []); // Only run once on component mount

  const handleNext = () => {
    if (currentTicket) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      console.error("Cannot proceed: No ticket in progress");
      dispatch(startNewTicket());
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    if (currentTicket) {
      dispatch(issueTicket());
      // Show a more professional confirmation instead of alert
      navigate('/cashier/dashboard', { 
        state: { ticketSuccess: true, ticketTimestamp: new Date().getTime() } 
      });
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <RouteSelectionStep
            onComplete={handleNext}
          />
        );
      case 1:
        return (
          <ReturnOptionsStep />
        );
      case 2:
        return (
          <PassengerCountStep />
        );
      case 3:
        return (
          <DiscountsStep
            onComplete={handleNext}
          />
        );
      case 4:
        return (
          <SeatSelectionStep
            onComplete={handleNext}
          />
        );
      case 5:
        return <ReviewStep />;
      default:
        return <Typography>Невалидна стъпка</Typography>;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
        Издаване на билет
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3 }}>
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Назад
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="success" onClick={handleFinish}>
              Издаване и плащане
            </Button>
          ) : (
             ![0, 3, 4].includes(activeStep) && (
                <Button variant="contained" onClick={handleNext}>
                  Напред
                </Button>
             )
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TicketIssuance; 