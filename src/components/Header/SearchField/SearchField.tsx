import React, { useState } from 'react';
import { Fade, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoClose } from 'react-icons/io5';
import SnackbarAlert from '../../SnackbarAlert';
import {
  StyledTextField,
  SearchIconButton,
  CloseIconButton,
  ExpandIconButton,
} from './SearchField.styles';

const SearchField = ({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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
          <StyledTextField
            label="Search"
            placeholder="Search by PayRef / Block Height / Block Hash"
            autoFocus
            value={query}
            onChange={handleInputChange}
            size="small"
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
