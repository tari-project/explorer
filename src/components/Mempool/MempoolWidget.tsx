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
import { useAllBlocks } from '@services/api/hooks/useBlocks';
import {
  TypographyData,
  TransparentDivider,
  TransparentBg,
} from '@components/StyledComponents';
import { Typography, Grid, Alert, Skeleton, Button, Box } from '@mui/material';
import { toHexString, shortenString } from '@utils/helpers';
import CopyToClipboard from '@components/CopyToClipboard';
import { useMainStore } from '@services/stores/useMainStore';
import InnerHeading from '@components/InnerHeading';

function MempoolTable() {
  const { data, isError, isLoading, error } = useAllBlocks();
  const isMobile = useMainStore((state) => state.isMobile);
  const Title = () => (
    <InnerHeading>Mempool ({data?.mempool.length || '0'})</InnerHeading>
  );

  const desktopCount = 5;
  const mobileCount = 5;

  function isMempoolArray(mempool: any): mempool is Array<any> {
    return Array.isArray(mempool);
  }

  function Mobile() {
    const col1 = 4;
    const col2 = 8;

    return (
      <Grid container spacing={2} pl={0} pr={0}>
        {data?.mempool.slice(0, mobileCount).map((item: any, index: number) => (
          <Fragment key={index}>
            <Grid item xs={col1}>
              <Typography variant="h6">Excess</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {' '}
                {shortenString(
                  toHexString(item.transaction.body.signature.data)
                )}
                <CopyToClipboard
                  copy={toHexString(item.transaction.body.signature.data)}
                  key={`${index}-copy`}
                />
              </TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="h6">Total Fees</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {item.transaction.body.total_fees}
              </TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="h6">Outputs</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {item.transaction.body.outputs.length}
              </TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="h6">Kernels</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {item.transaction.body.kernels.length}
              </TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="h6">Inputs</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {item.transaction.body.inputs.length}
              </TypographyData>
            </Grid>

            <Grid item xs={12}>
              <TransparentDivider />
            </Grid>
          </Fragment>
        ))}
      </Grid>
    );
  }

  function Desktop() {
    const col1 = 4;
    const col2 = 2;
    const col3 = 2;
    const col4 = 2;
    const col5 = 2;

    return (
      <>
        <Grid container spacing={2} pl={0} pr={0} pb={2} pt={2}>
          <Grid item xs={col1} md={col1} lg={col1}>
            <Typography variant="h6">Excess</Typography>
          </Grid>
          <Grid item xs={col2} md={col2} lg={col2}>
            <Typography variant="h6">Total Fees</Typography>
          </Grid>
          <Grid
            item
            xs={col3}
            md={col3}
            lg={col3}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="h6">Outputs</Typography>
          </Grid>
          <Grid
            item
            xs={col4}
            md={col4}
            lg={col4}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="h6">Kernels</Typography>
          </Grid>
          <Grid
            item
            xs={col5}
            md={col5}
            lg={col5}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="h6">Inputs</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} pl={0} pr={0} pb={2}>
          {data?.mempool
            .slice(0, desktopCount)
            .map((item: any, index: number) => (
              <Fragment key={index}>
                <Grid item xs={12}>
                  <TransparentDivider />
                </Grid>
                <Grid item xs={col1} md={col1} lg={col1}>
                  <TypographyData>
                    {shortenString(
                      toHexString(item.transaction.body.signature.data)
                    )}
                    <CopyToClipboard
                      copy={toHexString(item.transaction.body.signature.data)}
                      key={`${index}-copy`}
                    />
                  </TypographyData>
                </Grid>

                <Grid item xs={col2} md={col2} lg={col2}>
                  <TypographyData>
                    {item.transaction.body.total_fees}
                  </TypographyData>
                </Grid>

                <Grid
                  item
                  xs={col3}
                  md={col3}
                  lg={col3}
                  style={{ textAlign: 'center' }}
                >
                  <TypographyData>
                    {item.transaction.body.outputs.length}
                  </TypographyData>
                </Grid>

                <Grid
                  item
                  xs={col4}
                  md={col4}
                  lg={col4}
                  style={{ textAlign: 'center' }}
                >
                  <TypographyData>
                    {item.transaction.body.kernels.length}
                  </TypographyData>
                </Grid>

                <Grid
                  item
                  xs={col5}
                  md={col5}
                  lg={col5}
                  style={{ textAlign: 'center' }}
                >
                  <TypographyData>
                    {item.transaction.body.inputs.length}
                  </TypographyData>
                </Grid>
              </Fragment>
            ))}
        </Grid>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Title />
        <TransparentBg>
          <Alert severity="error" variant="outlined">
            {error?.message}
          </Alert>
        </TransparentBg>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Title />
        <Skeleton variant="rounded" width="100%" height={200} />
      </>
    );
  }

  if (!isMempoolArray(data?.mempool)) {
    return (
      <Alert severity="error" variant="outlined">
        Invalid data format
      </Alert>
    );
  }

  return (
    <>
      <Title />
      {data?.mempool.length === 0 && !isLoading && !isError ? (
        <Alert severity="info" variant="outlined">
          Mempool is empty
        </Alert>
      ) : isMobile ? (
        <Mobile />
      ) : (
        <Desktop />
      )}
      <Box
        style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
      >
        <Button
          href="/mempool/"
          color="secondary"
          variant="contained"
          style={{ minWidth: isMobile ? '100%' : '250px' }}
        >
          View Mempool
        </Button>
      </Box>
    </>
  );
}

export default MempoolTable;
