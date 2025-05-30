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
import SearchKernel from './SearchKernel';
import { StyledFormControlLabel } from './AdvancedSearch.styles';
import { useMainStore } from '@services/stores/useMainStore';
import { ThemeProvider } from '@emotion/react';
import { lightTheme } from '@theme/themes';
import InnerHeading from '@components/InnerHeading';
import { IoClose } from 'react-icons/io5';

export default function AdvancedSearch() {
  const searchOpen = useMainStore((state) => state.searchOpen);
  const setSearchOpen = useMainStore((state) => state.setSearchOpen);
  const [searchType, setSearchType] = useState<'block' | 'kernel'>('block');

  const handleClickOpen = () => {
    setSearchOpen(true);
  };

  const handleClose = () => {
    setSearchOpen(false);
  };

  const handleSearchTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchType(event.target.value as 'block' | 'kernel');
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
                  value="block"
                  control={<Radio />}
                  label="Block"
                />
                <StyledFormControlLabel
                  value="kernel"
                  control={<Radio />}
                  label="Kernel"
                />
              </RadioGroup>
            </FormControl>
            {searchType === 'block' ? <SearchBlock /> : <SearchKernel />}
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
