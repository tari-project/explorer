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
import { Box, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import {
  useAllBlocks,
  useGetBlockByHeightOrHash,
} from '@services/api/hooks/useBlocks';
import { shortenString } from '@utils/helpers';
import { useMediaQuery } from '@mui/material';
import { GradientPaper } from '@components/StyledComponents';
import {
  StyledButton,
  HeaderContainer,
  HeaderTitle,
  HeaderHeight,
  NavigationContainer,
  StyledIconButton,
} from './BlockHeader.styles';

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
  const nextLink = data?.height ? `/blocks/${data.height + 1}` : `/blocks/`;
  const prevLink = data?.height ? `/blocks/${data.height - 1}` : '/blocks/';

  useEffect(() => {
    if (isError || !data) {
      setPrevDisabled(true);
      setNextDisabled(true);
      return;
    }
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
  }, [data, isError, data?.height, tip]);

  return (
    <>
      <Container maxWidth="xl">
        {data?.height ? (
          <HeaderContainer isMobile={isMobile}>
            <HeaderTitle variant="h6">
              Block at Height
            </HeaderTitle>
            <HeaderHeight variant="h1" isMobile={isMobile}>
              {(data?.height || '').toLocaleString()}
            </HeaderHeight>
          </HeaderContainer>
        ) : (
          <HeaderContainer isMobile={isMobile}>
            <HeaderTitle variant="h6">
              {isFetching && 'Searching...'}
              {isError && 'Block not found'}
            </HeaderTitle>
            <HeaderHeight variant="h1" isMobile={isMobile}>
              {heightOrHash.length > 30
                ? shortenString(heightOrHash)
                : heightOrHash}
            </HeaderHeight>
          </HeaderContainer>
        )}
      </Container>
      <GradientPaper sx={{ padding: '0', marginBottom: 3 }}>
        <Container maxWidth="xl">
          <NavigationContainer>
            <Link to="/blocks/">
              <StyledButton>All Blocks</StyledButton>
            </Link>
            <Box>
              {prevDisabled ? (
                isMobile ? (
                  <StyledIconButton disabled={prevDisabled}>
                    <ChevronLeft />
                  </StyledIconButton>
                ) : (
                  <StyledButton
                    startIcon={<ChevronLeft />}
                    disabled={prevDisabled}
                  >
                    Previous Block
                  </StyledButton>
                )
              ) : (
                <Link to={prevLink}>
                  {isMobile ? (
                    <StyledIconButton disabled={prevDisabled}>
                      <ChevronLeft />
                    </StyledIconButton>
                  ) : (
                    <StyledButton
                      startIcon={<ChevronLeft />}
                      disabled={prevDisabled}
                    >
                      Previous Block
                    </StyledButton>
                  )}
                </Link>
              )}
              <Link to={`/blocks/${tip}`}>
                <StyledButton>Tip</StyledButton>
              </Link>
              {nextDisabled ? (
                isMobile ? (
                  <StyledIconButton disabled={nextDisabled}>
                    <ChevronRight />
                  </StyledIconButton>
                ) : (
                  <StyledButton
                    endIcon={<ChevronRight />}
                    disabled={nextDisabled}
                  >
                    Next Block
                  </StyledButton>
                )
              ) : (
                <Link to={nextLink}>
                  {isMobile ? (
                    <StyledIconButton disabled={nextDisabled}>
                      <ChevronRight />
                    </StyledIconButton>
                  ) : (
                    <StyledButton
                      endIcon={<ChevronRight />}
                      disabled={nextDisabled}
                    >
                      Next Block
                    </StyledButton>
                  )}
                </Link>
              )}
            </Box>
          </NavigationContainer>
        </Container>
      </GradientPaper>
    </>
  );
}

export default BlockHeader;
