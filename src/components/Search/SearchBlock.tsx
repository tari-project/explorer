import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, TextField } from '@mui/material';
import { useMainStore } from '@services/stores/useMainStore';

const SearchBlock = () => {
  const searchOpen = useMainStore((state) => state.searchOpen);
  const setSearchOpen = useMainStore((state) => state.setSearchOpen);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const validateQuery = (query: string) => {
    const height = parseInt(query);
    const isHeight = !isNaN(height) && height >= 0;
    const isHash = query.length === 64;
    return isHeight || isHash;
  };

  const handleSearch = () => {
    if (query === '') {
      return;
    }
    if (!validateQuery(query)) {
      setSearchOpen(false);
      setQuery('');
      return;
    }
    navigate(`/blocks/${query}`);
    setSearchOpen(false);
    setQuery('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
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
    </Stack>
  );
};

export default SearchBlock;
