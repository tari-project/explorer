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

import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import {
  useSearchByPayref,
  useGetBlockByHeightOrHash,
} from '@services/api/hooks/useBlocks';
import { useMediaQuery } from '@mui/material';
import { useEffect } from 'react';

function SearchPageHeader() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const hash = params.get('hash') || '';

  const { isFetching, isError, isSuccess, data } = useSearchByPayref(hash);
  const {
    isFetching: isBlockFetching,
    isError: isBlockError,
    isSuccess: isBlockSuccess,
    data: blockData,
  } = useGetBlockByHeightOrHash(hash);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  let status = '';

  // Determine status for payref search
  if (isFetching) {
    status = 'Searching...';
  } else if (isError || (isSuccess && data?.items.length === 0)) {
    // If payref search fails, check block search
    if (isBlockFetching) {
      status = 'Searching...';
    } else if (isBlockError || (isBlockSuccess && !blockData)) {
      status = 'Not found';
    } else if (isBlockSuccess && blockData) {
      status = 'Block found';
    }
  } else if (isSuccess && data?.items.length > 0) {
    status = `Block${data.items.length > 1 ? 's' : ''} found`;
  }

  useEffect(() => {
    // If payref search returns exactly one result, redirect to block with payref
    if (isSuccess && data?.items.length === 1) {
      const blockHeight = data.items[0].block_height;
      window.location.replace(`/blocks/${blockHeight}?payref=${hash}`);
    }
    // If payref search returns nothing, but block search succeeds, redirect to block
    else if (
      isSuccess &&
      data?.items.length === 0 &&
      isBlockSuccess &&
      blockData
    ) {
      window.location.replace(`/blocks/${blockData.header.height}`);
    }
  }, [isSuccess, data, hash, isBlockSuccess, blockData]);

  return (
    <>
      <Container maxWidth="xl">
        <Box
          style={{
            marginTop: isMobile ? theme.spacing(5) : theme.spacing(10),
            marginBottom: isMobile ? theme.spacing(5) : theme.spacing(10),
            color: theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? 0 : theme.spacing(1),
          }}
        >
          <Typography variant="body2" style={{ textTransform: 'uppercase' }}>
            Hash Search
          </Typography>
          <Typography
            variant="h1"
            style={{
              fontFamily: '"DrukHeavy", sans-serif',
              fontSize: isMobile ? 40 : 60,
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default SearchPageHeader;
