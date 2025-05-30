import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Alert, TextField } from '@mui/material';
import { useMainStore } from '@services/stores/useMainStore';

const SearchKernel = () => {
  const [inputValue, setInputValue] = useState({ nonce: '', signature: '' });
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState({ nonce: false, signature: false });

  const setSearchOpen = useMainStore((state) => state.setSearchOpen);
  const navigate = useNavigate();

  const handleKernelSearch = () => {
    setTouched({ nonce: true, signature: true });
    if (!inputValue.nonce || !inputValue.signature) {
      setMessage('Both fields are required.');
      return;
    }
    setMessage('');
    setSearchOpen(false);
    const params = new URLSearchParams();
    params.append('nonces', inputValue.nonce);
    params.append('signatures', inputValue.signature);
    navigate(`/kernel_search?${params.toString()}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleCancel = () => {
    setInputValue({ nonce: '', signature: '' });
    setSearchOpen(false);
  };

  return (
    <Stack gap={2} pb={2}>
      <TextField
        label="Nonce"
        placeholder="Enter Nonce"
        name="nonce"
        variant="outlined"
        size="small"
        autoFocus
        value={inputValue.nonce}
        onChange={handleSearchChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleKernelSearch();
          }
        }}
        fullWidth
        required
        error={touched.nonce && !inputValue.nonce}
        helperText={
          touched.nonce && !inputValue.nonce ? 'Nonce is required' : ''
        }
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Signature"
        placeholder="Enter Signature"
        name="signature"
        variant="outlined"
        size="small"
        value={inputValue.signature}
        onChange={handleSearchChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleKernelSearch();
          }
        }}
        fullWidth
        required
        error={touched.signature && !inputValue.signature}
        helperText={
          touched.signature && !inputValue.signature
            ? 'Signature is required'
            : ''
        }
        InputLabelProps={{ shrink: true }}
      />

      <Stack direction="row" gap={1} justifyContent="flex-end">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleKernelSearch} variant="contained">
          Search
        </Button>
      </Stack>
      {message && (
        // <Typography variant="body2" color="textSecondary">
        //   {message}
        // </Typography>

        <Alert severity="error" variant="standard">
          {message}
        </Alert>
      )}
    </Stack>
  );
};

export default SearchKernel;
