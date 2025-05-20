import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  DirectionsRailway as TrainIcon,
  ArrowBack as BackIcon,
  Wifi as WifiIcon,
  Restaurant as RestaurantIcon,
  AcUnit as AcIcon,
  Accessible as AccessibleIcon,
  Luggage as LuggageIcon,
  Pets as PetsIcon,
  SmokingRooms as SmokingIcon,
  Power as PowerIcon,
  Business as FirstClassIcon,
  Chair as SecondClassIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface TrainClass {
  type: 'first' | 'second';
  available: boolean;
  price?: number;
}

interface TrainAmenities {
  wifi: boolean;
  restaurant: boolean;
  airConditioning: boolean;
  accessible: boolean;
  luggageSpace: boolean;
  petsAllowed: boolean;
  smokingArea: boolean;
  powerOutlets: boolean;
}

interface TrainDetails {
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
  platform?: string;
  track?: string;
  operator?: string;
  trainType?: string;
  notes?: string;
  amenities: TrainAmenities;
  stops?: {
    station: string;
    arrivalTime?: string;
    departureTime?: string;
  }[];
}

// Add custom color constant
const BDZ_GREEN = '#006837';

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const Header = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  color: BDZ_GREEN,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  border: `1px solid ${BDZ_GREEN}`,
}));

const TrainInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'nowrap',
}));

const TrainNumber = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 700,
  color: BDZ_GREEN,
  whiteSpace: 'nowrap',
  minWidth: '120px',
}));

const RouteInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flex: 1,
  '& .MuiTypography-root': {
    fontSize: '1.2rem',
    fontWeight: 500,
    color: BDZ_GREEN,
  },
  '& .separator': {
    color: BDZ_GREEN,
    margin: '0 8px',
  }
}));

const PlatformInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: BDZ_GREEN,
  borderRadius: theme.shape.borderRadius,
  '& .MuiTypography-root': {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: theme.palette.common.white,
  }
}));

const RouteMap = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  minHeight: '120px',
}));

const RouteContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2, 0, 3, 0),
  margin: theme.spacing(0, 1),
}));

const RouteLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  height: 4,
  backgroundColor: BDZ_GREEN,
  transform: 'translateY(-50%)',
  zIndex: 1,
}));

const StopsContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  minHeight: '70px',
}));

const Stop = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  width: '90px',
  '&:first-of-type': {
    width: 'auto',
    alignItems: 'flex-start',
    paddingRight: theme.spacing(1),
  },
  '&:last-of-type': {
    width: 'auto',
    alignItems: 'flex-end',
    paddingLeft: theme.spacing(1),
  }
}));

const StopDot = styled(Box)(({ theme }) => ({
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  border: `4px solid ${BDZ_GREEN}`,
  boxShadow: `0 0 0 2px ${BDZ_GREEN}`,
  position: 'relative',
  zIndex: 2,
}));

const StopInfo = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  marginTop: theme.spacing(0.75),
  textAlign: 'center',
  width: '100%',
  minHeight: '50px',
  '&:first-of-type': {
    left: 0,
    transform: 'none',
    textAlign: 'left',
  },
  '&:last-of-type': {
    left: 'auto',
    right: 0,
    transform: 'none',
    textAlign: 'right',
  },
  '& .station': {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(0.25),
    display: 'block',
  },
  '& .time': {
    fontSize: '0.7rem',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    display: 'block',
    lineHeight: 1.1,
    marginBottom: theme.spacing(0.25),
  }
}));

const AmenitiesSection = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const AmenityChip = styled(Chip)(({ theme }) => ({
  '& .MuiChip-icon': {
    fontSize: '1.1rem',
    marginLeft: theme.spacing(0.5),
  },
  '& .MuiChip-label': {
    fontSize: '0.9rem',
  },
}));

const ClassSelection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const ClassButton = styled(Button)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1.5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
  '& .price': {
    fontSize: '1.1rem',
    fontWeight: 600,
  }
}));

const BackButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const TrainDetailsView: React.FC<{ trainDetails: TrainDetails }> = ({ trainDetails }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleClassSelect = (classType: 'first' | 'second') => {
    // Handle class selection
    console.log(`Selected class: ${classType}`);
  };

  const renderAmenities = (amenities: TrainAmenities) => {
    const amenityItems = [
      { key: 'wifi', icon: <WifiIcon />, label: 'WiFi', value: amenities.wifi },
      { key: 'restaurant', icon: <RestaurantIcon />, label: 'Ресторант', value: amenities.restaurant },
      { key: 'airConditioning', icon: <AcIcon />, label: 'Климатик', value: amenities.airConditioning },
      { key: 'accessible', icon: <AccessibleIcon />, label: 'Достъп', value: amenities.accessible },
      { key: 'luggageSpace', icon: <LuggageIcon />, label: 'Багаж', value: amenities.luggageSpace },
      { key: 'petsAllowed', icon: <PetsIcon />, label: 'Домашни', value: amenities.petsAllowed },
      { key: 'smokingArea', icon: <SmokingIcon />, label: 'Пушалня', value: amenities.smokingArea },
      { key: 'powerOutlets', icon: <PowerIcon />, label: 'Контакти', value: amenities.powerOutlets },
    ];

    return (
      <AmenitiesSection>
        {amenityItems.map(({ key, icon, label, value }) => (
          value && (
            <AmenityChip
              key={key}
              icon={icon}
              label={label}
              size="small"
              color="primary"
              variant="outlined"
            />
          )
        ))}
      </AmenitiesSection>
    );
  };

  // Use the stops from trainDetails instead of hardcoded data
  const stops = trainDetails.stops || [
    { station: trainDetails.fromStation, departureTime: trainDetails.departureTime },
    { station: trainDetails.toStation, arrivalTime: trainDetails.arrivalTime }
  ];

  return (
    <Container>
      <BackButton
        variant="outlined"
        startIcon={<BackIcon />}
        onClick={handleBack}
        fullWidth
        size="large"
        sx={{ borderColor: BDZ_GREEN, color: BDZ_GREEN }}
      >
        Назад към разписанието
      </BackButton>

      <Header>
        <TrainInfo>
          <TrainIcon sx={{ fontSize: '2rem', color: BDZ_GREEN }} />
          <TrainNumber>
            {trainDetails.trainNumber}
          </TrainNumber>
          <RouteInfo>
            <Typography>{trainDetails.fromStation}</Typography>
            <Typography className="separator">→</Typography>
            <Typography>{trainDetails.toStation}</Typography>
          </RouteInfo>
        </TrainInfo>
        <PlatformInfo>
          <TrainIcon sx={{ fontSize: '1.2rem', color: 'common.white' }} />
          <Typography>
            Перон {trainDetails.platform}
            {trainDetails.track && ` • Коловоз ${trainDetails.track}`}
          </Typography>
        </PlatformInfo>
      </Header>

      <RouteMap>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, px: 1 }}>
          Маршрут
        </Typography>
        <RouteContainer>
          <RouteLine />
          <StopsContainer>
            {stops.map((stop, index) => (
              <Stop key={index}>
                <StopDot />
                <StopInfo>
                  <Typography className="station">
                    {stop.station}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {stop.arrivalTime && (
                      <Typography className="time">
                        {stop.arrivalTime}
                      </Typography>
                    )}
                    {stop.departureTime && (
                      <Typography className="time">
                        {stop.departureTime}
                      </Typography>
                    )}
                  </Box>
                </StopInfo>
              </Stop>
            ))}
          </StopsContainer>
        </RouteContainer>
      </RouteMap>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Удобства
        </Typography>
        {renderAmenities(trainDetails.amenities)}
      </Paper>

      <ClassSelection>
        {trainDetails.classes.map((cls) => (
          cls.available && (
            <ClassButton
              key={cls.type}
              variant="contained"
              color="primary"
              onClick={() => handleClassSelect(cls.type)}
              startIcon={cls.type === 'first' ? <FirstClassIcon /> : <SecondClassIcon />}
            >
              {cls.type === 'first' ? 'I клас' : 'II клас'}
              {cls.price && (
                <Typography className="price">
                  {cls.price.toFixed(2)} лв.
                </Typography>
              )}
            </ClassButton>
          )
        ))}
      </ClassSelection>
    </Container>
  );
};

export default TrainDetailsView; 