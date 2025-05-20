import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
  IconButton,
  Fade,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/store';
import { setTicketType, TicketType } from '../../store/features/tickets/ticketsSlice';
import { setCurrentStep } from '../../store/features/tickets/ticketsSlice';

const TicketTypeCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const TicketSelection: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentStep, totalSteps } = useSelector((state: RootState) => state.tickets);
  const { fontSize, isHighContrast } = useSelector((state: RootState) => state.settings);

  const handleTicketTypeSelect = (type: TicketType) => {
    dispatch(setTicketType(type));
    navigate('/ticket/search');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCancel = () => {
    navigate('/menu');
  };

  const ticketTypes = [
    {
      type: 'oneWay' as TicketType,
      icon: <ArrowForwardIcon sx={{ fontSize: 48 }} />,
      title: t('ticketSelection.types.oneWay.title'),
      description: t('ticketSelection.types.oneWay.description'),
    },
    {
      type: 'return' as TicketType,
      icon: <SwapHorizIcon sx={{ fontSize: 48 }} />,
      title: t('ticketSelection.types.return.title'),
      description: t('ticketSelection.types.return.description'),
    }
  ];

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
            aria-label={t('ticketSelection.back')}
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
            {t('ticketSelection.step', { current: currentStep, total: totalSteps })}
          </Typography>

          <IconButton
            onClick={handleCancel}
            color="primary"
            aria-label={t('ticketSelection.cancel')}
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
          {t('ticketSelection.title')}
        </Typography>

        {/* Ticket Type Selection */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
            },
            gap: 3,
            flexGrow: 1,
            mb: 4,
            maxWidth: '700px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {ticketTypes.map(({ type, icon, title, description }) => (
            <TicketTypeCard
              key={type}
              onClick={() => handleTicketTypeSelect(type)}
              sx={{
                backgroundColor: isHighContrast ? theme.palette.primary.main : 'background.paper',
                color: isHighContrast ? theme.palette.primary.contrastText : 'inherit',
                minHeight: '220px',
                maxHeight: '250px',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                }}
              >
                <Box sx={{ mb: 2, color: 'primary.main' }}>
                  {React.cloneElement(icon, { sx: { fontSize: 40 } })}
                </Box>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontSize: `${fontSize * 1.2}px`,
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: `${fontSize}px`,
                    color: isHighContrast ? 'inherit' : 'text.secondary',
                  }}
                >
                  {description}
                </Typography>
              </CardContent>
            </TicketTypeCard>
          ))}
        </Box>
      </Container>
    </Fade>
  );
};

export default TicketSelection; 