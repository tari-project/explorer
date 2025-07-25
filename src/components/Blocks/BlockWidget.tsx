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
import { TypographyData, TransparentBg } from '@components/StyledComponents';
import {
  Typography,
  Grid,
  Divider,
  Button,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  toHexString,
  shortenString,
  formatTimestamp,
  powCheck,
} from '@utils/helpers';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import CopyToClipboard from '@components/CopyToClipboard';
import { useMainStore } from '@services/stores/useMainStore';

function BlockWidget() {
  const theme = useTheme();
  const { data, isLoading, isError, error } = useAllBlocks();
  const isMobile = useMainStore((state) => state.isMobile);
  const desktopCount = 9;
  const mobileCount = 5;

  function Mobile() {
    const col1 = 4;
    const col2 = 8;

    if (isError) {
      return (
        <TransparentBg>
          <Alert severity="error" variant="outlined">
            {error?.message}
          </Alert>
        </TransparentBg>
      );
    }

    if (isLoading) {
      const loaderHeight = 300;
      const renderSkeleton = Array.from({ length: mobileCount }, (_, index) => (
        <Grid item xs={12} key={index}>
          <Skeleton variant="rounded" height={loaderHeight} />
        </Grid>
      ));
      return (
        <Grid container spacing={2} pl={0} pr={0}>
          {renderSkeleton}
        </Grid>
      );
    }

    return (
      <Grid container spacing={2} pl={0} pr={0}>
        {data?.headers
          .slice(0, mobileCount)
          .map((block: any, index: number) => (
            <Fragment key={index}>
              <Grid item xs={col1}>
                <Typography variant="h6">Height</Typography>
              </Grid>
              <Grid item xs={col2}>
                <TypographyData>
                  <Link to={`/blocks/${block.height}`}>
                    {parseInt(block.height).toLocaleString()}{' '}
                  </Link>
                </TypographyData>
              </Grid>

              <Grid item xs={col1}>
                <Typography variant="h6">Timestamp</Typography>
              </Grid>
              <Grid item xs={col2}>
                <TypographyData>
                  {formatTimestamp(block.timestamp)}
                </TypographyData>
              </Grid>

              <Grid item xs={col1}>
                <Typography variant="h6">Proof of Work</Typography>
              </Grid>
              <Grid item xs={col2}>
                <TypographyData>{powCheck(block.pow.pow_algo)}</TypographyData>
              </Grid>

              <Grid item xs={col1}>
                <Typography variant="h6">Hash</Typography>
              </Grid>
              <Grid item xs={col2}>
                <TypographyData>
                  {shortenString(toHexString(block.hash.data), 6, 6)}
                  <CopyToClipboard copy={toHexString(block.hash.data)} />
                </TypographyData>
              </Grid>

              <Grid item xs={col1}>
                <Typography variant="h6">Kernels</Typography>
              </Grid>
              <Grid item xs={col2}>
                <TypographyData>{block.kernels}</TypographyData>
              </Grid>

              <Grid item xs={col1}>
                <Typography variant="h6">Outputs</Typography>
              </Grid>
              <Grid item xs={col2}>
                <TypographyData>{block.outputs}</TypographyData>
              </Grid>

              <Grid item xs={12}>
                <Link to={`/blocks/${block.height}`}>
                  <Button variant="outlined" fullWidth>
                    View Block
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Divider
                  color={theme.palette.background.paper}
                  style={{ background: 'none' }}
                />
              </Grid>
            </Fragment>
          ))}
        <Grid item xs={12}>
          <Button
            href="/blocks/"
            color="secondary"
            variant="contained"
            style={{ minWidth: isMobile ? '100%' : '250px' }}
          >
            View All Blocks
          </Button>
        </Grid>
      </Grid>
    );
  }

  function Desktop() {
    const col1 = 1.5;
    const col2 = 2.5;
    const col3 = 2.5;
    const col4 = 3.5;
    const col5 = 1;
    const col6 = 1;

    if (isError) {
      return (
        <TransparentBg height="850px">
          <Alert severity="error" variant="outlined">
            {error?.message}
          </Alert>
        </TransparentBg>
      );
    }

    if (isLoading) {
      const loaderHeight = 60;
      const renderSkeleton = Array.from(
        { length: desktopCount + 2 },
        (_, index) => (
          <Grid item xs={12} key={index}>
            <Skeleton variant="rounded" height={loaderHeight} />
          </Grid>
        )
      );
      return (
        <>
          <Grid container spacing={2} pl={0} pr={0} pb={2}>
            {renderSkeleton}
          </Grid>
        </>
      );
    }

    return (
      <>
        <Grid container spacing={2} pl={0} pr={0} pb={2} pt={2}>
          <Grid item xs={col1} md={col1} lg={col1}>
            <Typography variant="h6">Height</Typography>
          </Grid>
          <Grid item xs={col2} md={col2} lg={col2}>
            <Typography variant="h6">Time</Typography>
          </Grid>
          <Grid item xs={col3} md={col3} lg={col3}>
            <Typography variant="h6">Proof of Work</Typography>
          </Grid>
          <Grid item xs={col4} md={col4} lg={col4}>
            <Typography variant="h6">Hash</Typography>
          </Grid>
          <Grid
            item
            xs={col5}
            md={col5}
            lg={col5}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="h6">Kernels</Typography>
          </Grid>
          <Grid
            item
            xs={col6}
            md={col6}
            lg={col6}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="h6">Outputs</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} pl={0} pr={0} pb={2}>
          {data?.headers
            .slice(0, desktopCount)
            .map((block: any, index: number) => (
              <Fragment key={index}>
                <Grid item xs={12}>
                  <Divider
                    color={theme.palette.divider}
                    style={{
                      background: 'none',
                    }}
                  />
                </Grid>
                <Grid item xs={col1} md={col1} lg={col1}>
                  <TypographyData>
                    <Link to={`/blocks/${block.height}`}>
                      {parseInt(block.height).toLocaleString()}{' '}
                    </Link>
                  </TypographyData>
                </Grid>
                <Grid item xs={col2} md={col2} lg={col2}>
                  <TypographyData>
                    {formatTimestamp(block.timestamp)}
                  </TypographyData>
                </Grid>
                <Grid item xs={col3} md={col3} lg={col3}>
                  <TypographyData>
                    {powCheck(block.pow.pow_algo)}
                  </TypographyData>
                </Grid>
                <Grid item xs={col4} md={col4} lg={col4}>
                  <TypographyData>
                    {shortenString(toHexString(block.hash.data), 6, 6)}
                    <CopyToClipboard copy={toHexString(block.hash.data)} />
                  </TypographyData>
                </Grid>
                <Grid
                  item
                  xs={col5}
                  md={col5}
                  lg={col5}
                  style={{ textAlign: 'center' }}
                >
                  <TypographyData>{block.kernels}</TypographyData>
                </Grid>
                <Grid
                  item
                  xs={col6}
                  md={col6}
                  lg={col6}
                  style={{ textAlign: 'center' }}
                >
                  <TypographyData>{block.outputs}</TypographyData>
                </Grid>
              </Fragment>
            ))}
          <Grid
            item
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: theme.spacing(3),
            }}
          >
            <Divider />
            <Button
              href="/blocks/"
              color="secondary"
              variant="contained"
              style={{ minWidth: isMobile ? '100%' : '250px' }}
            >
              View All Blocks
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }

  return <>{isMobile ? <Mobile /> : <Desktop />}</>;
}

export default BlockWidget;
