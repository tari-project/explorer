import * as React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Radio,
  RadioGroup,
  FormControl,
} from '@mui/material';
import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import SearchBlock from './SearchBlock';
import SearchPayRef from './SearchPayRef';
import { StyledFormControlLabel } from './AdvancedSearch.styles';
import { useMainStore } from '@services/stores/useMainStore';
import { ThemeProvider } from '@emotion/react';
import { lightTheme } from '@theme/themes';
import InnerHeading from '@components/InnerHeading';
import { IoClose } from 'react-icons/io5';

type SearchType = 'payref' | 'block' | 'kernel';

export default function AdvancedSearch() {
  const searchOpen = useMainStore((state) => state.searchOpen);
  const setSearchOpen = useMainStore((state) => state.setSearchOpen);
  const [searchType, setSearchType] = useState<SearchType>('payref');

  const handleClickOpen = () => {
    setSearchOpen(true);
  };

  const handleClose = () => {
    setSearchOpen(false);
  };

  const handleSearchTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchType(event.target.value as SearchType);
  };

  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <IconButton
          color="inherit"
          onClick={handleClickOpen}
          aria-label="search"
        >
          <IoSearch size={20} />
        </IconButton>
        <Dialog fullWidth maxWidth="sm" open={searchOpen} onClose={handleClose}>
          <DialogContent>
            <InnerHeading
              icon={
                <IconButton aria-label="close search" onClick={handleClose}>
                  <IoClose />
                </IconButton>
              }
              borderBottom={false}
            >
              Search For
            </InnerHeading>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup
                row
                value={searchType}
                onChange={handleSearchTypeChange}
                name="search-type"
              >
                <StyledFormControlLabel
                  value="payref"
                  control={<Radio />}
                  label="Payment Reference (PayRef)"
                />
                <StyledFormControlLabel
                  value="block"
                  control={<Radio />}
                  label="Block"
                />
              </RadioGroup>
            </FormControl>
            {searchType === 'payref' ? <SearchPayRef /> : <SearchBlock />}
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
