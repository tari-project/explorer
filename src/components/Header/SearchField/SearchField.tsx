import React, { useState } from 'react';
import { Fade, InputAdornment, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoClose } from 'react-icons/io5';
import SnackbarAlert from '../../SnackbarAlert';
import {
  SearchIconButton,
  CloseIconButton,
  ExpandIconButton,
} from './SearchField.styles';
import { useMainStore } from '@services/stores/useMainStore';

const SearchField = ({
  isExpanded,
  setIsExpanded,
  fullWidth = false,
}: {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  fullWidth?: boolean;
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isMobile = useMainStore((state) => state.isMobile);

  const handleSearch = () => {
    if (query === '') {
      setIsExpanded(false);
      return;
    }
    const isHeight = /^\d+$/.test(query);
    const isHash = /^[a-fA-F0-9]{64}$/.test(query);

    if (!isHeight && !isHash) {
      setOpen(true);
      setQuery('');
      setIsExpanded(false);
      return;
    }

    if (isHeight) {
      navigate(`/blocks/${query}`);
    } else if (isHash) {
      navigate(`/search?hash=${query}`);
    }
    setQuery('');
    setIsExpanded(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase().trim());
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
      setIsExpanded(false);
    }
  };

  return (
    <>
      <SnackbarAlert open={open} setOpen={setOpen} message="Invalid query" />
      {isExpanded && (
        <Fade in={isExpanded} timeout={500}>
          <TextField
            label="Search by PayRef / Block Height / Block Hash"
            placeholder="Enter 64 character hash or block height"
            autoFocus
            value={query}
            onChange={handleInputChange}
            size="small"
            style={{ width: fullWidth || isMobile ? '100%' : '440px' }}
            onKeyPress={handleKeyPress}
            InputProps={
              query !== ''
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIconButton onClick={handleSearch}>
                          <IoSearch />
                        </SearchIconButton>
                      </InputAdornment>
                    ),
                  }
                : {
                    endAdornment: (
                      <InputAdornment position="end">
                        <CloseIconButton onClick={() => setIsExpanded(false)}>
                          <IoClose />
                        </CloseIconButton>
                      </InputAdornment>
                    ),
                  }
            }
          />
        </Fade>
      )}
      {!isExpanded && (
        <Fade in={!isExpanded}>
          <ExpandIconButton onClick={() => setIsExpanded(true)}>
            <IoSearch />
          </ExpandIconButton>
        </Fade>
      )}
    </>
  );
};

export default SearchField;
