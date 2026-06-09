import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from '@mui/material/Alert';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../context/ThemeContext';

function ForgotPassword({ open, handleClose }) {
  const { theme } = useTheme();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess('A password reset link has been sent to your email.');
        setTimeout(() => {
          handleCancel();
        }, 3000);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEmail('');
    setError('');
    setSuccess('');
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit,
          sx: { 
            backgroundImage: 'none',
            backgroundColor: theme === 'light' ? 'var(--color-fin-surface)' : 'var(--color-fin-bg-elevated)',
            border: '1px solid var(--color-fin-border)',
            color: 'var(--color-fin-text)',
          },
        },
      }}
    >
      <DialogTitle sx={{ color: 'var(--color-fin-text)', fontWeight: 'bold' }}>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', minWidth: { xs: 280, sm: 400 } }}
      >
        <DialogContentText sx={{ color: 'var(--color-fin-muted)' }}>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>
        
        {error && (
          <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--color-fin-text)', border: '1px solid rgba(239, 68, 68, 0.2)', '& .MuiAlert-icon': { color: '#ef4444' } }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ backgroundColor: 'rgba(139, 92, 246, 0.08)', color: 'var(--color-fin-text)', border: '1px solid rgba(139, 92, 246, 0.2)', '& .MuiAlert-icon': { color: 'var(--color-fin-accent)' } }}>
            {success}
          </Alert>
        )}

        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="your@email.com"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || !!success}
          sx={{
            color: 'var(--color-fin-text)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-fin-border)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-fin-muted)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-fin-accent)',
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleCancel} disabled={loading} sx={{ color: 'var(--color-fin-muted)', '&:hover': { color: 'var(--color-fin-text)' } }}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          type="submit" 
          disabled={loading || !!success}
          sx={{ 
            backgroundColor: 'var(--color-fin-accent)', 
            color: 'var(--color-fin-text-inverse)', 
            fontWeight: 'bold',
            '&:hover': { 
              backgroundColor: 'var(--color-fin-accent-strong)' 
            },
            '&.Mui-disabled': {
              backgroundColor: 'var(--color-fin-border)',
              color: 'var(--color-fin-muted)',
            }
          }}
        >
          {loading ? 'Sending...' : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;