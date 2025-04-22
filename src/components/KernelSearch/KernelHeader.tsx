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
import { useSearchByKernel } from '@services/api/hooks/useBlocks';
import { useMediaQuery } from '@mui/material';

function KernelHeader() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const noncesParams = params.get('nonces');
  const nonces = noncesParams ? noncesParams.split(',') : [];

  const signaturesParams = params.get('signatures');
  const signatures = signaturesParams ? signaturesParams.split(',') : [];

  const { isFetching, isError, isSuccess, data } = useSearchByKernel(
    nonces,
    signatures
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  let status = '';
  switch (true) {
    case isFetching:
      status = 'Searching...';
      break;
    case isError:
      status = 'Block not found';
      break;
    case isSuccess:
      status = `Block${data.items.length > 1 ? 's' : ''} found`;
      break;
    default:
      status = '';
  }

  return (
    <>
      {!isMobile ? (
        <Container maxWidth="xl">
          <Box
            style={{
              marginTop: theme.spacing(10),
              marginBottom: theme.spacing(10),
              color: theme.palette.text.primary,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing(1),
            }}
          >
            <Typography variant="body2" style={{ textTransform: 'uppercase' }}>
              Kernel Search
            </Typography>
            <Typography
              variant="h1"
              style={{
                fontFamily: '"DrukHeavy", sans-serif',
                fontSize: 60,
                textTransform: 'uppercase',
              }}
            >
              {status}
            </Typography>
          </Box>
        </Container>
      ) : null}
    </>
  );
}

export default KernelHeader;
