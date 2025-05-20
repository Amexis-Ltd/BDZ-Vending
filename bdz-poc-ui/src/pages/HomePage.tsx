import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardActions,
  Grid,
  TextField,
  ButtonProps,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CampaignIcon from '@mui/icons-material/Campaign';
import LandscapeIcon from '@mui/icons-material/Landscape';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { bg } from 'date-fns/locale/bg';
import { useAppSelector } from '../store/hooks';
import { selectIsCustomerLoggedIn } from '../store/features/auth/authSlice';

// Styled Components
const HeroBanner = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(8, 2),
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  backgroundImage: 'url("https://images.unsplash.com/photo-1506677513809-d4b1e5737cca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80")',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  borderRadius: '0 0 12px 12px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: alpha(theme.palette.primary.dark, 0.4),
    borderRadius: 'inherit',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

const SearchModule = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(-8),
  position: 'relative',
  zIndex: 10,
  maxWidth: '900px',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: theme.spacing(0, 2),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(-6),
  }
}));

const QuickLinksContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  margin: theme.spacing(6, 0),
  padding: theme.spacing(3, 0),
  backgroundColor: alpha(theme.palette.grey[100], 0.5),
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(4, 0),
      padding: theme.spacing(2, 0),
  }
}));

// Explicitly include props needed by RouterLink and the component prop
interface QuickLinkItemProps extends ButtonProps {
  component?: React.ElementType;
  to?: string; // Prop from react-router-dom Link
}

const QuickLinkItem = styled(Button)<QuickLinkItemProps>(({ theme }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  textDecoration: 'none',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  padding: theme.spacing(2, 1.5),
  borderRadius: '8px',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  minWidth: '120px',
  textTransform: 'none',
  border: 'none',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.15),
    transform: 'translateY(-4px)',
    boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
    border: 'none',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    marginBottom: theme.spacing(0.5),
    color: theme.palette.primary.main,
  },
  [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      minWidth: '80px',
      fontSize: '0.8rem',
      '& .MuiSvgIcon-root': {
          fontSize: '2rem',
      }
  }
}));

const Section = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  paddingTop: theme.spacing(4),
  borderTop: `1px solid ${theme.palette.divider}`,
  '&:first-of-type': {
      borderTop: 'none',
      paddingTop: 0, 
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  elevation: 1,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
  }
}));

const DestinationImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  display: 'block',
});

// --- HomePage Component --- 
const HomePage: React.FC = () => {
  const [fromStation, setFromStation] = useState<string>('');
  const [toStation, setToStation] = useState<string>('');
  const [searchDate, setSearchDate] = useState<Date | null>(new Date());
  const isCustomerLoggedIn = useAppSelector(selectIsCustomerLoggedIn);
  const navigate = useNavigate();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const searchData = {
          from: fromStation,
          to: toStation,
          date: searchDate ? searchDate.toLocaleDateString('bg-BG') : null,
      };
      console.log('Navigating to search results with:', searchData);
      navigate('/search-results', { state: searchData });
  };

  return (
    <Box sx={{ backgroundColor: '#fcfcfc' }}>
      {/* Hero Banner */}
      <HeroBanner>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0,0,0,0.5)', fontWeight: 700 }}>
            Пътувайте изгодно с БДЖ!
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 3, color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', fontWeight: 400 }}>
            Открийте най-добрите оферти за уикенд пътувания и групови билети.
      </Typography>
          <Button variant="contained" size="large" color="secondary" startIcon={<SearchIcon />}>
            Вижте промоциите
          </Button>
        </Container>
      </HeroBanner>

      {/* Search Module */}
      <SearchModule>
        <Card elevation={6} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Typography variant="h6" component="h2" textAlign="center" gutterBottom sx={{ mb: 3 }}>
            <SearchIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Търсене на билети
      </Typography>
          <Box component="form" onSubmit={handleSearchSubmit}>
            <Grid container spacing={2} alignItems="flex-end">
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 1 }}>
                <TextField 
                    fullWidth 
                    label="От гара" 
                    variant="outlined" 
                    placeholder="Например: София" 
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 1 }}>
                <TextField 
                    fullWidth 
                    label="До гара" 
                    variant="outlined" 
                    placeholder="Например: Пловдив" 
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '16.67%' }, p: 1 }}>
                 <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
                    <DatePicker
                        label="Дата"
                        value={searchDate}
                        onChange={(newValue) => setSearchDate(newValue)}
                        slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                    />
                </LocalizationProvider>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '16.67%' }, p: 1 }}>
                <Button fullWidth type="submit" variant="contained" size="large" startIcon={<SearchIcon />}>
                  Търсене
                </Button>
              </Box>
            </Grid>
          </Box>
        </Card>
      </SearchModule>

      <Container maxWidth="lg">
        {/* Quick Links */}
        <QuickLinksContainer>
          <Typography variant="h5" component="h2" gutterBottom>Бързи връзки</Typography>
          <Grid container spacing={2} justifyContent="center">
            <Box sx={{ p: 1 }}>
              <QuickLinkItem
                component={RouterLink}
                to="/schedule"
                sx={{ textDecoration: 'none' }}
              >
                <CalendarTodayIcon />
                Разписание
              </QuickLinkItem>
            </Box>
            <Box sx={{ p: 1 }}>
              <QuickLinkItem
                component={RouterLink}
                to={isCustomerLoggedIn ? '/profile' : '/customer-login'}
                sx={{ textDecoration: 'none' }}
              >
                <AccountCircleOutlinedIcon />
                Моят профил
              </QuickLinkItem>
            </Box>
            <Box sx={{ p: 1 }}>
              <QuickLinkItem href="/info" sx={{ textDecoration: 'none' }}>
                <InfoOutlinedIcon />
                Информация
              </QuickLinkItem>
            </Box>
            <Box sx={{ p: 1 }}>
              <QuickLinkItem href="/map" sx={{ textDecoration: 'none' }}>
                <MapOutlinedIcon />
                Карта на мрежата
              </QuickLinkItem>
            </Box>
          </Grid>
        </QuickLinksContainer>

        {/* News Section */}
        <Section>
          <Typography variant="h5" component="h2" gutterBottom><CampaignIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Новини и съобщения</Typography>
          <Grid container spacing={0}>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 1.5 }}> 
              <StyledCard>
                <Box sx={{ flexGrow: 1, p: 2}}>
                  <Typography variant="h6" component="h3">Промени в разписанието</Typography>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom><CalendarTodayIcon sx={{ fontSize: 'inherit', mr: 0.5 }} /> 05.04.2025</Typography>
                  <Typography variant="body2">Във връзка с ремонтни дейности по жп линията София-Пловдив...</Typography>
                </Box>
                <CardActions>
                  <QuickLinkItem href="#" sx={{ padding: '8px 12px', minWidth: 'auto', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    Прочети повече <ArrowForwardIcon fontSize="small" />
                  </QuickLinkItem>
                </CardActions>
              </StyledCard>
            </Box>
             <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 1.5 }}> 
               <StyledCard>
                 <Box sx={{ flexGrow: 1, p: 2}}>
                    <Typography variant="h6" component="h3">Нова онлайн платформа</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom><CalendarTodayIcon sx={{ fontSize: 'inherit', mr: 0.5 }} /> 01.04.2025</Typography>
                    <Typography variant="body2">БДЖ пуска нова, модерна платформа за онлайн закупуване на билети...</Typography>
                 </Box>
                <CardActions>
                  <QuickLinkItem href="#" sx={{ padding: '8px 12px', minWidth: 'auto', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    Прочети повече <ArrowForwardIcon fontSize="small" />
                  </QuickLinkItem>
                </CardActions>
               </StyledCard>
            </Box>
             <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 1.5 }}> 
               <StyledCard>
                 <Box sx={{ flexGrow: 1, p: 2}}>
                    <Typography variant="h6" component="h3">Лятна промоция</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom><CalendarTodayIcon sx={{ fontSize: 'inherit', mr: 0.5 }} /> 28.03.2025</Typography>
                    <Typography variant="body2">Пътувайте до морето с 20% намаление през юли и август...</Typography>
                 </Box>
                <CardActions>
                  <QuickLinkItem href="#" sx={{ padding: '8px 12px', minWidth: 'auto', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    Прочети повече <ArrowForwardIcon fontSize="small" />
                  </QuickLinkItem>
                </CardActions>
               </StyledCard>
            </Box>
          </Grid>
        </Section>

        {/* Destinations Section */}
        <Section>
          <Typography variant="h5" component="h2" gutterBottom><LandscapeIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Туристически дестинации</Typography>
          <Grid container spacing={0}>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 1.5 }}> 
              <StyledCard>
                 <DestinationImage src="https://placehold.co/600x400/DDDDDD/333333?text=Пловдив" alt="Пловдив" />
                 <Box sx={{ flexGrow: 1, p: 2}}>
                  <Typography variant="h6" component="h3">Пловдив - Древен и вечен</Typography>
                  <Typography variant="body2">Разходете се из Стария град, посетете Античния театър и усетете духа на хилядолетна история.</Typography>
                 </Box>
                <CardActions>
                  <QuickLinkItem href="#" sx={{ padding: '8px 12px', minWidth: 'auto', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    Научете повече <ArrowForwardIcon fontSize="small" />
                  </QuickLinkItem>
                </CardActions>
              </StyledCard>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 1.5 }}> 
              <StyledCard>
                 <DestinationImage src="https://placehold.co/600x400/CCCCCC/333333?text=Рилски+Манастир" alt="Рилски манастир" />
                 <Box sx={{ flexGrow: 1, p: 2}}>
                  <Typography variant="h6" component="h3">Рилски Манастир</Typography>
                  <Typography variant="body2">Посетете най-големия и известен православен манастир в България, част от световното наследство на ЮНЕСКО.</Typography>
                 </Box>
                <CardActions>
                  <QuickLinkItem href="#" sx={{ padding: '8px 12px', minWidth: 'auto', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    Научете повече <ArrowForwardIcon fontSize="small" />
                  </QuickLinkItem>
                </CardActions>
              </StyledCard>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 1.5 }}> 
              <StyledCard>
                 <DestinationImage src="https://placehold.co/600x400/EEEEEE/333333?text=Велико+Търново" alt="Велико Търново" />
                 <Box sx={{ flexGrow: 1, p: 2}}>
                  <Typography variant="h6" component="h3">Велико Търново</Typography>
                  <Typography variant="body2">Разгледайте крепостта Царевец и се потопете в средновековната история на България.</Typography>
                 </Box>
                <CardActions>
                  <QuickLinkItem href="#" sx={{ padding: '8px 12px', minWidth: 'auto', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    Научете повече <ArrowForwardIcon fontSize="small" />
                  </QuickLinkItem>
                </CardActions>
              </StyledCard>
            </Box>
          </Grid>
        </Section>

      </Container>
    </Box>
  );
};

export default HomePage; 