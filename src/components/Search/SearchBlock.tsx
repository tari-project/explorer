import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, TextField, Alert } from '@mui/material';
import { useMainStore } from '@services/stores/useMainStore';
import { validateHash, validateHeight } from '@utils/helpers';

const SearchBlock = () => {
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

  const validateQuery = (query: string) => {
    const isHeight = validateHeight(query);
    const isHash = validateHash(query);
    return isHeight || isHash;
  };

  const handleSearch = () => {
    if (query === '') {
      return;
    }
    if (!validateQuery(query)) {
      setMessage('Please enter a valid block height or hash');
      setQuery('');
      return;
    }
    navigate(`/blocks/${query}`);
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
        label="Search by height or hash"
        placeholder="Enter block height or hash"
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

export default SearchBlock;
