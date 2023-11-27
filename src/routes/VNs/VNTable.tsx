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

import { Fragment } from 'react';
import { useAllBlocks } from '../../api/hooks/useBlocks';
import {
  InnerHeading,
  TypographyData,
} from '../../components/StyledComponents';
import { Typography, Grid, Divider, Alert } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FetchStatusCheck from '../../components/FetchStatusCheck';

function VNTable() {
  const { data, isError, isLoading } = useAllBlocks();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  function Mobile() {
    const col1 = 4;
    const col2 = 8;

    return (
      <Grid container spacing={2} pl={2} pr={2}>
        {data?.activeVns.map((item: any, index: number) => (
          <Fragment key={index}>
            <Grid item xs={col1}>
              <Typography variant="body2">Public Key</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>Pubkey Data</TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="body2">Shard Key</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>Shardkey Data</TypographyData>
            </Grid>

            <Grid item xs={12}>
              <Divider color={theme.palette.background.paper} />
            </Grid>
          </Fragment>
        ))}
      </Grid>
    );
  }

  function Desktop() {
    const col1 = 6;
    const col2 = 6;

    return (
      <>
        <Grid container spacing={2} pl={2} pr={2} pb={2} pt={2}>
          <Grid item xs={col1} md={col1} lg={col1}>
            <Typography variant="body2">Public Key</Typography>
          </Grid>
          <Grid item xs={col2} md={col2} lg={col2}>
            <Typography variant="body2">Shard Key</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} pl={2} pr={2} pb={2}>
          {data?.activeVns.map((item: any, index: number) => (
            <Fragment key={index}>
              <Grid item xs={12}>
                <Divider color={theme.palette.background.paper} />
              </Grid>
              <Grid item xs={col1} md={col1} lg={col1}>
                <TypographyData>Pubkey Data</TypographyData>
              </Grid>
              <Grid item xs={col2} md={col2} lg={col2}>
                <TypographyData>Shardkey Data</TypographyData>
              </Grid>
            </Fragment>
          ))}
        </Grid>
      </>
    );
  }

  return (
    <>
      <InnerHeading>Active Validator Nodes</InnerHeading>
      <FetchStatusCheck
        errorMessage="error"
        isError={isError}
        isLoading={isLoading}
      />
      {data?.activeVns.length === 0 && !isLoading && !isError ? (
        <Alert severity="info">No active validator nodes</Alert>
      ) : isMobile ? (
        <Mobile />
      ) : (
        <Desktop />
      )}
    </>
  );
}

export default VNTable;
