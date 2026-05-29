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

function ForgotPassword({ open, handleClose }) {
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
            backgroundColor: '#0a0a0a',
            border: '1px solid #1f1f1f',
            color: '#fff',
          },
        },
      }}
    >
      <DialogTitle sx={{ color: '#fff', fontWeight: 'bold' }}>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', minWidth: { xs: 280, sm: 400 } }}
      >
        <DialogContentText sx={{ color: '#aaa' }}>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>
        
        {error && (
          <Alert severity="error" sx={{ backgroundColor: '#1a0d0d', color: '#ff8888', border: '1px solid #3d1a1a', '& .MuiAlert-icon': { color: '#ff8888' } }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ backgroundColor: '#0d1a0d', color: '#88ff88', border: '1px solid #1a3d1a', '& .MuiAlert-icon': { color: '#88ff88' } }}>
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
            color: '#fff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#222',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#444',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF6B00',
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleCancel} disabled={loading} sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          type="submit" 
          disabled={loading || !!success}
          sx={{ 
            backgroundColor: '#FF6B00', 
            color: '#000', 
            fontWeight: 'bold',
            '&:hover': { 
              backgroundColor: '#e05e00' 
            },
            '&.Mui-disabled': {
              backgroundColor: '#333',
              color: '#666',
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