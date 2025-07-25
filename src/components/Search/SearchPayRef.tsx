import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, TextField, Alert } from '@mui/material';
import { useMainStore } from '@services/stores/useMainStore';
import { validatePayRefQuery } from '@utils/validatePayRefQuery';

const PayRef = () => {
  const searchOpen = useMainStore((state) => state.searchOpen);
  const setSearchOpen = useMainStore((state) => state.setSearchOpen);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = () => {
    if (query === '') {
      return;
    }
    if (!validatePayRefQuery(query)) {
      setMessage('Please enter a valid payment reference');
      setQuery('');
      return;
    }
    navigate(`/search_outputs_by_payref?payref=${query}`);
    setSearchOpen(false);
    setQuery('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase().trim());
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCancel = () => {
    setSearchOpen(false);
  };

  return (
    <Stack gap={1} pb={2}>
      <TextField
        label="Search by payment reference"
        placeholder="Enter 64-character PayRef hash"
        autoFocus
        value={query}
        onChange={handleInputChange}
        size="small"
        onKeyPress={handleKeyPress}
        fullWidth
        InputLabelProps={{ shrink: true }}
        inputRef={inputRef}
      />
      <Stack direction="row" gap={1} justifyContent="flex-end">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSearch} variant="contained">
          Search
        </Button>
      </Stack>
      {message && (
        <Alert severity="error" variant="standard">
          {message}
        </Alert>
      )}
    </Stack>
  );
};

export default PayRef;
