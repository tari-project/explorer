//  Copyright 2022. The Tari Project
//
//  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
//  following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
//  disclaimer.
//
//  2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
//  following disclaimer in the documentation and/or other materials provided with the distribution.
//
//  3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
//  products derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
//  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
//  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
//  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
//  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
//  USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoClose } from 'react-icons/io5';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import SnackbarAlert from '../../components/SnackbarAlert';

const SearchField = ({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
          <TextField
            label="Search by height or hash"
            style={{
              width: isMobile ? '100%' : '400px',
            }}
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
                        <IconButton
                          onClick={handleSearch}
                          style={{
                            padding: 0,
                            borderRadius: 40,
                            background: 'none',
                          }}
                        >
                          <IoSearch />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                : {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setIsExpanded(false)}
                          style={{
                            padding: 0,
                            borderRadius: 40,
                            background: 'none',
                          }}
                        >
                          <IoClose />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
            }
          />
        </Fade>
      )}
      {!isExpanded && (
        <Fade in={!isExpanded}>
          <IconButton
            onClick={() => setIsExpanded(true)}
            style={{
              borderRadius: 40,
            }}
          >
            <IoSearch />
          </IconButton>
        </Fade>
      )}
    </>
  );
};

export default SearchField;
