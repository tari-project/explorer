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

  const validateQuery = (query: string) => {
    const height = parseInt(query);
    const isHeight = !isNaN(height) && height >= 0;
    const isHash = query.length === 64;
    return isHeight || isHash;
  };

  const handleSearch = () => {
    if (query === '') {
      setIsExpanded(false);
      return;
    }
    if (!validateQuery(query)) {
      setOpen(true);
      setQuery('');
      setIsExpanded(false);
      return;
    }
    navigate(`/blocks/${query}`);
    setQuery('');
    setIsExpanded(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
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
            label="Search by height or hash"
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
