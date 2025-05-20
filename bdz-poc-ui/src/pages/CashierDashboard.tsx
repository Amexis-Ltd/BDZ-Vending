import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Container,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  startShift,
  endShift,
  selectShiftStatus,
  selectCurrentShift,
  selectShiftHistory,
} from '../store/features/shift/shiftSlice';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import TicketOperations from './cashier/TicketOperations';
import CardOperations from './cashier/CardOperations';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const BANKNOTE_DENOMINATIONS = [100, 50, 20, 10, 5, 2, 1];

interface BanknoteInput {
  denomination: number;
  count: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

const MainTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const CashierDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const isShiftActive = useAppSelector(selectShiftStatus);
  const currentShift = useAppSelector(selectCurrentShift);
  const shiftHistory = useAppSelector(selectShiftHistory);
  const navigate = useNavigate();

  // Dialog states
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);

  // Form states
  const [initialDeposit, setInitialDeposit] = useState('');
  const [initialCards, setInitialCards] = useState('');
  const [remainingCards, setRemainingCards] = useState('');
  const [banknotes, setBanknotes] = useState<BanknoteInput[]>(
    BANKNOTE_DENOMINATIONS.map(denom => ({ denomination: denom, count: '' }))
  );
  
  // State for main operation tab
  const [mainTabValue, setMainTabValue] = useState(0);

  const handleMainTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setMainTabValue(newValue);
  };

  const handleStartShift = () => {
    dispatch(startShift({
      deposit: Number(initialDeposit),
      cards: Number(initialCards),
    }));
    console.log('--- SIMULATING PRINTING ПКО (Deposit Receipt) ---');
    console.log('Депозит:', Number(initialDeposit));
    console.log('--- END SIMULATION ---');
    setStartDialogOpen(false);
    setInitialDeposit('');
    setInitialCards('');
  };

  const handleEndShift = () => {
    const finalBanknotes = banknotes
      .filter(note => note.count !== '')
      .map(note => ({
        denomination: note.denomination,
        count: Number(note.count),
      }));

    dispatch(endShift({
      banknotes: finalBanknotes,
      remainingCards: Number(remainingCards),
    }));
    console.log('--- SIMULATING PRINTING Z-ОТЧЕТ (End of Shift) ---');
    console.log('Общо банкноти:', calculateTotal());
    console.log('Оставащи карти:', Number(remainingCards));
    console.log('--- END SIMULATION ---');
    setEndDialogOpen(false);
    setBanknotes(BANKNOTE_DENOMINATIONS.map(denom => ({ denomination: denom, count: '' })));
    setRemainingCards('');
  };

  const handleBanknoteChange = (denomination: number, value: string) => {
    setBanknotes(prev => 
      prev.map(note => 
        note.denomination === denomination 
          ? { ...note, count: value }
          : note
      )
    );
  };

  const calculateTotal = () => {
    return banknotes.reduce((sum, note) => 
      sum + (note.denomination * (Number(note.count) || 0)), 
      0
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Каса
        </Typography>
        
        <Box sx={{ width: '100%' }}>
          {/* Shift Status and Controls */}
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Статус на смяната
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setStartDialogOpen(true)}
                  disabled={isShiftActive}
                >
                  Начало на смяна
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setEndDialogOpen(true)}
                  disabled={!isShiftActive}
                >
                  Край на смяна
                </Button>
              </Box>
            </Box>
            
            <Typography 
              variant="body1" 
              color={isShiftActive ? 'success.main' : 'error.main'} 
              sx={{ fontWeight: 'bold', mb: 2 }}
            >
              {isShiftActive ? 'Активна смяна' : 'Няма активна смяна'}
            </Typography>
            
            {currentShift && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Начало на смяната: {new Date(currentShift.startTime).toLocaleString('bg-BG')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Начален депозит: {currentShift.initialDeposit} лв.
                </Typography>
                {currentShift.initialCards && (
                  <Typography variant="body2" color="text.secondary">
                    Начални карти: {currentShift.initialCards} бр.
                  </Typography>
                )}
              </Box>
            )}
          </StyledPaper>

          {/* Main Operations Area - Only show when shift is active */}
          {isShiftActive && (
            <Box sx={{ width: '100%' }}>
              <MainTabs 
                value={mainTabValue} 
                onChange={handleMainTabChange} 
                aria-label="main cashier operations tabs"
                variant="fullWidth"
              >
                <Tab label="Билети" icon={<ReceiptIcon />} iconPosition="start" />
                <Tab label="Карти" icon={<CreditCardIcon />} iconPosition="start" />
              </MainTabs>

              {/* Conditional Rendering based on mainTabValue */} 
              {mainTabValue === 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<ReceiptIcon />}
                      onClick={() => navigate('/cashier/tickets')}
                    >
                      Нов билет
                    </Button>
                  </Box>
                  <TicketOperations />
                </>
              )}
              {mainTabValue === 1 && (
                <CardOperations />
              )}
            </Box>
          )}

          {!isShiftActive && (
            <Alert severity="warning" sx={{ mt: 3 }}>Моля, започнете смяна, за да активирате операциите.</Alert>
          )}

          {/* Shift History */}
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              История на смените
            </Typography>
            <TableContainer sx={{ flexGrow: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Начало</TableCell>
                    <TableCell>Край</TableCell>
                    <TableCell align="right">Начален депозит</TableCell>
                    <TableCell align="right">Крайна сума</TableCell>
                    <TableCell align="right">Карти начало/край</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shiftHistory.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell>
                        {new Date(shift.startTime).toLocaleString('bg-BG', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        {shift.endTime ? new Date(shift.endTime).toLocaleString('bg-BG', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : '-'}
                      </TableCell>
                      <TableCell align="right">{shift.initialDeposit} лв.</TableCell>
                      <TableCell align="right">{shift.totalAmount} лв.</TableCell>
                      <TableCell align="right">
                        {shift.initialCards}/{shift.remainingCards}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Box>
      </Box>

      {/* Start Shift Dialog */}
      <Dialog open={startDialogOpen} onClose={() => setStartDialogOpen(false)}>
        <DialogTitle>Начало на смяна</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Депозитна сума"
            type="number"
            fullWidth
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Брой налични MiFare DESFire карти"
            type="number"
            fullWidth
            value={initialCards}
            onChange={(e) => setInitialCards(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStartDialogOpen(false)}>Отказ</Button>
          <Button onClick={handleStartShift} variant="contained">
            Потвърди
          </Button>
        </DialogActions>
      </Dialog>

      {/* End Shift Dialog */}
      <Dialog 
        open={endDialogOpen} 
        onClose={() => setEndDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Край на смяна</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Налични банкноти:
          </Typography>
          {banknotes.map((note) => (
            <TextField
              key={note.denomination}
              margin="dense"
              label={`${note.denomination} лв.`}
              type="number"
              fullWidth
              value={note.count}
              onChange={(e) => handleBanknoteChange(note.denomination, e.target.value)}
            />
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Обща сума: {calculateTotal()} лв.
          </Typography>
          <TextField
            margin="dense"
            label="Налични MiFare DESFire карти"
            type="number"
            fullWidth
            value={remainingCards}
            onChange={(e) => setRemainingCards(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEndDialogOpen(false)}>Отказ</Button>
          <Button onClick={handleEndShift} variant="contained">
            Потвърди
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CashierDashboard; 