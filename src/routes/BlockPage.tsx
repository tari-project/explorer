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

import Grid from '@mui/material/Grid';
import { GradientPaper } from '@components/StyledComponents';
import { useTheme } from '@mui/material/styles';
import BlockInfo from '@components/Blocks/BlockInfo';
import { useLocation } from 'react-router-dom';
import { useGetBlockByHeightOrHash } from '@services/api/hooks/useBlocks';
import FetchStatusCheck from '@components/FetchStatusCheck';
import BlockParts from '@components/Blocks/BlockParts';
import BlockRewards from '@components/Blocks/BlockRewards';

function BlockPage() {
  const theme = useTheme();
  const { pathname } = useLocation();
  const blockHeight = pathname.split('/')[2];
  const { isLoading, isError, error } = useGetBlockByHeightOrHash(blockHeight);

  if (isLoading || isError) {
    return (
      <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <GradientPaper>
              <FetchStatusCheck
                isError={isError}
                isLoading={isLoading}
                errorMessage={error?.message || 'Error retrieving data'}
              />
            </GradientPaper>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid item xs={12} md={12} lg={12}>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          md={12}
          lg={6}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(3),
          }}
        >
          <GradientPaper>
            <BlockInfo blockHeight={blockHeight} />
          </GradientPaper>
          <GradientPaper>
            <BlockRewards blockHeight={blockHeight} />
          </GradientPaper>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={6}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(3),
          }}
        >
          <GradientPaper>
            <BlockParts
              blockHeight={blockHeight}
              type="kernels"
              itemsPerPage={5}
            />
          </GradientPaper>
          <GradientPaper>
            <BlockParts
              blockHeight={blockHeight}
              type="outputs"
              itemsPerPage={5}
            />
          </GradientPaper>
          <GradientPaper>
            <BlockParts
              blockHeight={blockHeight}
              type="inputs"
              itemsPerPage={5}
            />
          </GradientPaper>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BlockPage;
