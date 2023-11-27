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
import { toHexString, shortenString } from '../../utils/helpers';
import CopyToClipboard from '../../components/CopyToClipboard';

function MempoolTable() {
  const { data, isError, isLoading } = useAllBlocks();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  function Mobile() {
    const col1 = 4;
    const col2 = 8;

    return (
      <Grid container spacing={2} pl={2} pr={2}>
        {data?.mempool.map((item: any, index: number) => (
          <Fragment key={index}>
            <Grid item xs={col1}>
              <Typography variant="body2">Excess</Typography>
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
              <Typography variant="body2">Total Fees</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {item.transaction.body.total_fees}
              </TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="body2">Outputs</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {item.transaction.body.outputs.length}
              </TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="body2">Kernels</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {item.transaction.body.kernels.length}
              </TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="body2">Inputs</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {item.transaction.body.inputs.length}
              </TypographyData>
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
    const col1 = 4;
    const col2 = 2;
    const col3 = 2;
    const col4 = 2;
    const col5 = 2;

    return (
      <>
        <Grid container spacing={2} pl={2} pr={2} pb={2} pt={2}>
          <Grid item xs={col1} md={col1} lg={col1}>
            <Typography variant="body2">Excess</Typography>
          </Grid>
          <Grid item xs={col2} md={col2} lg={col2}>
            <Typography variant="body2">Total Fees</Typography>
          </Grid>
          <Grid
            item
            xs={col3}
            md={col3}
            lg={col3}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="body2">Outputs</Typography>
          </Grid>
          <Grid
            item
            xs={col4}
            md={col4}
            lg={col4}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="body2">Kernels</Typography>
          </Grid>
          <Grid
            item
            xs={col5}
            md={col5}
            lg={col5}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="body2">Inputs</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} pl={2} pr={2} pb={2}>
          {data?.mempool.map((item: any, index: number) => (
            <Fragment key={index}>
              <Grid item xs={12}>
                <Divider color={theme.palette.background.paper} />
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

  return (
    <>
      <InnerHeading>Mempool</InnerHeading>
      <FetchStatusCheck
        errorMessage="Error Message"
        isError={isError}
        isLoading={isLoading}
      />
      {data?.mempool.length === 0 && !isLoading && !isError ? (
        <Alert severity="info">Mempool is empty</Alert>
      ) : isMobile ? (
        <Mobile />
      ) : (
        <Desktop />
      )}
      {/* {isMobile ? <Mobile /> : <Desktop />} */}
    </>
  );
}

export default MempoolTable;
