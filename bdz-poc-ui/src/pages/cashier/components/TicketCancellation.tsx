import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextareaAutosize,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  fontFamily: theme.typography.fontFamily,
  fontSize: '0.875rem',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  borderColor: theme.palette.divider,
  resize: 'vertical',
  minRows: 3,
}));

const TicketCancellation: React.FC = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleCancelTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber || !reason) {
      setError("Моля, въведете номер на билет и причина.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      console.log("Cancelling ticket:", { ticketNumber, reason });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(`Билет ${ticketNumber} е успешно анулиран.`);
      console.log(`--- SIMULATING PRINTING СТОРНО (Cancellation) for ticket ${ticketNumber} ---`);
      // In real app: return funds, update ticket status
      setTicketNumber('');
      setReason('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Възникна грешка при анулирането на билета.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancellation = async () => {
    setOpenConfirmDialog(false);
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("Cancelling ticket:", ticketNumber, "Reason:", reason);
      if (!ticketNumber) {
          throw new Error("Липсва номер на билет.");
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(`Билет ${ticketNumber} е успешно анулиран.`);
      setTicketNumber('');
      setReason('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Възникна грешка при анулирането.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Анулиране на билет
      </Typography>
      
      <Box component="form" onSubmit={handleCancelTicket}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Номер на билет"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            required
            variant="outlined"
            size="small"
            disabled={loading}
          />
          <StyledTextarea
            aria-label="reason for cancellation"
            placeholder="Причина за анулиране *"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            disabled={loading}
          />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={loading || !ticketNumber || !reason}
          >
            {loading ? 'Анулиране...' : 'Анулирай билет'}
          </Button>
        </Box>
      </Box>
      
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Потвърждение за анулиране"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Сигурни ли сте, че искате да анулирате (сторно) билет с номер {ticketNumber}? 
            Тази операция е необратима.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Отказ</Button>
          <Button onClick={handleConfirmCancellation} color="error" variant="contained" autoFocus disabled={loading}>
             {loading ? 'Обработка...' : 'Потвърди анулиране'}
          </Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
};

export default TicketCancellation; 