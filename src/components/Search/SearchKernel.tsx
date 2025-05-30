// import React, { useState } from 'react';
// import { useSearchByKernel } from '@services/api/hooks/useBlocks';
// import { useNavigate } from 'react-router-dom';
// import SnackbarAlert from '@components/SnackbarAlert';
// import { StyledTextField } from './SearchBlock.styles';
// import { Button, Stack, Typography, TextField, Alert } from '@mui/material';
// import { useMainStore } from '@services/stores/useMainStore';

// const SearchKernel = () => {
//   const setSearchOpen = useMainStore((state) => state.setSearchOpen);
//   const [query, setQuery] = useState('');
//   const [searchValue, setSearchValue] = useState({
//     nonce: '',
//     signature: '',
//   });
//   const { data: kernelSearchData, isLoading: isKernelSearchLoading } =
//     useSearchByKernel(
//       searchValue.nonce ? [searchValue.nonce] : [],
//       searchValue.signature ? [searchValue.signature] : []
//     );

//   console.log('kernelSearchData', kernelSearchData);

//   const navigate = useNavigate();

//   const validateQuery = (query: string) => {
//     const height = parseInt(query);
//     const isHeight = !isNaN(height) && height >= 0;
//     const isHash = query.length === 64;
//     return isHeight || isHash;
//   };

//   const handleSearch = () => {
//     if (query === '') {
//       return;
//     }
//     // if (!validateQuery(query)) {
//     //   setOpen(true);
//     //   setQuery('');
//     //   return;
//     // }
//     // navigate(`/blocks/${query}`);

//     setQuery('');
//   };

//   const handleKernelSearch = () => {
//     console.log('Searching for kernel with:', searchValue);
//     setSearchOpen(false);
//   };

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     setSearchValue({
//       ...searchValue,
//       [event.target.name]: value,
//     });
//   };

//   const handleCancel = () => {
//     setSearchValue({ nonce: '', signature: '' });
//     setSearchOpen(false);
//   };

//   return (
//     <>
//       {/* <SnackbarAlert open={open} setOpen={setOpen} message="Invalid query" /> */}
//       <Stack gap={1} pb={2}>
//         <TextField
//           label="Enter Nonce"
//           name="nonce"
//           variant="outlined"
//           size="small"
//           autoFocus
//           value={searchValue.nonce}
//           onChange={handleSearchChange}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               handleKernelSearch();
//             }
//           }}
//           fullWidth
//         />
//         <TextField
//           label="Enter Signature"
//           name="signature"
//           variant="outlined"
//           size="small"
//           value={searchValue.signature}
//           onChange={handleSearchChange}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               handleKernelSearch();
//             }
//           }}
//           fullWidth
//         />

//         <Stack direction="row" gap={1} justifyContent="flex-end">
//           <Button onClick={handleCancel}>Cancel</Button>
//           <Button onClick={handleKernelSearch} variant="contained">
//             Search
//           </Button>
//         </Stack>
//       </Stack>
//     </>
//   );
// };

// export default SearchKernel;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Typography, TextField } from '@mui/material';
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
        <Typography variant="body2" color="textSecondary">
          {message}
        </Typography>
      )}
    </Stack>
  );
};

export default SearchKernel;
