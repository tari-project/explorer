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

import { useState, useEffect } from 'react';
import { Button, Box, Container, Typography, IconButton } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import {
  useAllBlocks,
  useGetBlockByHeightOrHash,
} from '../../api/hooks/useBlocks';
import { shortenString } from '../../utils/helpers';
import { useMediaQuery } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  fontSize: 12,
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

function BlockHeader() {
  const { pathname } = useLocation();
  const heightOrHash = pathname.split('/')[2];
  const { data, isFetching, isError } = useGetBlockByHeightOrHash(heightOrHash);
  const { data: tipInfo } = useAllBlocks();
  const [nextDisabled, setNextDisabled] = useState(false);
  const [prevDisabled, setPrevDisabled] = useState(false);
  const theme = useTheme();
  const tip = tipInfo?.tipInfo.metadata.best_block_height;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (data?.height === 0) {
      setPrevDisabled(true);
    } else {
      setPrevDisabled(false);
    }
    if (data?.height >= tip) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }, [data?.height, tip]);

  return (
    <>
      <Container maxWidth="xl">
        {data?.height ? (
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
              Block at Height
            </Typography>
            <Typography
              variant="h1"
              style={{
                fontFamily: '"AvenirHeavy", sans-serif',
                fontSize: 60,
              }}
            >
              {data?.height}
            </Typography>
          </Box>
        ) : (
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
              {isFetching && 'Searching...'}
              {isError && 'Block not found'}
            </Typography>
            <Typography
              variant="h1"
              style={{
                fontFamily: '"AvenirHeavy", sans-serif',
                fontSize: 60,
              }}
            >
              {heightOrHash.length > 30
                ? shortenString(heightOrHash)
                : heightOrHash}
            </Typography>
          </Box>
        )}
      </Container>
      <Box
        style={{
          backgroundColor: theme.palette.divider,
          width: '100%',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Box
            style={{
              borderTop: theme.palette.divider,
              paddingTop: theme.spacing(1),
              paddingBottom: theme.spacing(1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Link to="/blocks/">
              <StyledButton>All Blocks</StyledButton>
            </Link>
            <Box>
              <Link to={data?.prevLink}>
                {isMobile ? (
                  <IconButton
                    disabled={prevDisabled}
                    style={{ color: theme.palette.text.primary }}
                  >
                    <ChevronLeft />
                  </IconButton>
                ) : (
                  <StyledButton
                    startIcon={<ChevronLeft />}
                    disabled={prevDisabled}
                  >
                    Previous Block
                  </StyledButton>
                )}
              </Link>
              <Link to={`/blocks/${tip}`}>
                <StyledButton>Tip</StyledButton>
              </Link>
              <Link to={data?.nextLink}>
                {isMobile ? (
                  <IconButton
                    disabled={nextDisabled}
                    style={{ color: theme.palette.text.primary }}
                  >
                    <ChevronRight />
                  </IconButton>
                ) : (
                  <StyledButton
                    endIcon={<ChevronRight />}
                    disabled={nextDisabled}
                  >
                    Next Block
                  </StyledButton>
                )}
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default BlockHeader;
