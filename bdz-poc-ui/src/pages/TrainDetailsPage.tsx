import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import TrainDetailsView from '../components/TrainDetailsView/TrainDetailsView';

const TrainDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log('TrainDetailsPage - Location state:', location.state);
  const trainDetails = location.state?.trainDetails;
  console.log('TrainDetailsPage - Train details:', trainDetails);

  // If no train details are provided, redirect back to schedule
  React.useEffect(() => {
    console.log('TrainDetailsPage - Effect triggered, trainDetails:', trainDetails);
    if (!trainDetails) {
      console.log('TrainDetailsPage - No train details, redirecting to schedule');
      navigate('/schedule');
    }
  }, [trainDetails, navigate]);

  if (!trainDetails) {
    console.log('TrainDetailsPage - Rendering null because no train details');
    return null;
  }

  console.log('TrainDetailsPage - Rendering TrainDetailsView with:', trainDetails);
  return (
    <Container maxWidth="md" disableGutters>
      <TrainDetailsView trainDetails={trainDetails} />
    </Container>
  );
};

export default TrainDetailsPage; 