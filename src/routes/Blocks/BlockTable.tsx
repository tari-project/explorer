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

import { useState, useEffect, Fragment } from 'react';
import { useAllBlocks, useGetBlocksByParam } from '../../api/hooks/useBlocks';
import {
  InnerHeading,
  TypographyData,
} from '../../components/StyledComponents';
import { Typography, Grid, Divider, ButtonGroup } from '@mui/material';
import {
  toHexString,
  shortenString,
  formatTimestamp,
} from '../../utils/helpers';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import CopyToClipboard from '../../components/CopyToClipboard';
import { useMediaQuery } from '@mui/material';

function BlockTable() {
  const { data: tipData } = useAllBlocks();
  const tip = tipData?.tipInfo?.metadata?.height_of_longest_chain;
  const [blocksPerPage, setBlocksPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [firstHeight, setFirstHeight] = useState(tip || 0);
  const { data } = useGetBlocksByParam(firstHeight, blocksPerPage);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [selectedButton, setSelectedButton] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (tip && firstHeight === 0) {
      setFirstHeight(parseInt(tip));
    }
  }, [tip, firstHeight]);

  useEffect(() => {
    if (page === 1) {
      setPrevDisabled(true);
    } else {
      setPrevDisabled(false);
    }
    if (data && data.headers.length < blocksPerPage) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }, [firstHeight]);

  const handleChange = (value: number) => () => {
    setBlocksPerPage(value);
    setPage(1);
    setFirstHeight(parseInt(tip));
    setSelectedButton(value);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      setFirstHeight(firstHeight + blocksPerPage);
    }
  };

  const handleNextPage = () => {
    if (data && data.headers.length === blocksPerPage) {
      setPage(page + 1);
      setFirstHeight(firstHeight - blocksPerPage);
    }
  };

  const handleGoToTip = () => {
    setFirstHeight(parseInt(tip));
    setPage(1);
  };

  function Mobile() {
    const col1 = 4;
    const col2 = 8;

    return (
      <Grid container spacing={2} pl={2} pr={2}>
        {data?.headers.map((block: any, index: number) => (
          <Fragment key={index}>
            <Grid item xs={col1}>
              <Typography variant="body2">Height</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                <Link to={`/blocks/${block.height}`}>{block.height} </Link>
              </TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="body2">Timestamp</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {formatTimestamp(block.timestamp)}
              </TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="body2">Proof of Work</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {block.pow.pow_algo === '0' ? 'Monero' : 'SHA-3'}
              </TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="body2">Hash</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>
                {shortenString(toHexString(block.hash.data))}
                <CopyToClipboard copy={toHexString(block.hash.data)} />
              </TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="body2">Kernels</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>{block.kernels}</TypographyData>
            </Grid>

            <Grid item xs={col1}>
              <Typography variant="body2">Outputs</Typography>
            </Grid>
            <Grid item xs={col2}>
              <TypographyData>{block.outputs}</TypographyData>
            </Grid>

            <Grid item xs={12}>
              <Button
                onClick={() => window.open(`/blocks/${block.height}`)}
                variant="outlined"
                fullWidth
              >
                View Block
              </Button>
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
    const col1 = 2;
    const col2 = 3;
    const col3 = 2;
    const col4 = 3;
    const col5 = 1;
    const col6 = 1;

    return (
      <>
        <Grid container spacing={2} pl={2} pr={2} pb={2} pt={2}>
          <Grid item xs={col1} md={col1} lg={col1}>
            <Typography variant="body2">Height</Typography>
          </Grid>
          <Grid item xs={col2} md={col2} lg={col2}>
            <Typography variant="body2">Time</Typography>
          </Grid>
          <Grid item xs={col3} md={col3} lg={col3}>
            <Typography variant="body2">Proof of Work</Typography>
          </Grid>
          <Grid item xs={col4} md={col4} lg={col4}>
            <Typography variant="body2">Hash</Typography>
          </Grid>
          <Grid
            item
            xs={col5}
            md={col5}
            lg={col5}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="body2">Kernels</Typography>
          </Grid>
          <Grid
            item
            xs={col6}
            md={col6}
            lg={col6}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="body2">Outputs</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} pl={2} pr={2} pb={2}>
          {data?.headers.map((block: any, index: number) => (
            <Fragment key={index}>
              <Grid item xs={12}>
                <Divider color={theme.palette.background.paper} />
              </Grid>
              <Grid item xs={col1} md={col1} lg={col1}>
                <TypographyData>
                  <Link to={`/blocks/${block.height}`}>{block.height} </Link>
                </TypographyData>
              </Grid>
              <Grid item xs={col2} md={col2} lg={col2}>
                <TypographyData>
                  {formatTimestamp(block.timestamp)}
                </TypographyData>
              </Grid>
              <Grid item xs={col3} md={col3} lg={col3}>
                <TypographyData>
                  {block.pow.pow_algo === '0' ? 'Monero' : 'SHA-3'}
                </TypographyData>
              </Grid>
              <Grid item xs={col4} md={col4} lg={col4}>
                <TypographyData>
                  {shortenString(toHexString(block.hash.data))}
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
        </Grid>
      </>
    );
  }

  return (
    <>
      <InnerHeading>All Blocks</InnerHeading>
      {isMobile ? <Mobile /> : <Desktop />}
      <Divider />
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: theme.spacing(2),
          gap: theme.spacing(2),
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Typography variant="caption">
          Showing blocks {firstHeight - blocksPerPage + 1} - {firstHeight}
        </Typography>
        <ButtonGroup
          variant="contained"
          disableElevation
          size="small"
          style={{ paddingRight: 20, paddingLeft: 20 }}
        >
          <Button
            onClick={handlePreviousPage}
            disabled={prevDisabled}
            style={{ paddingRight: 20, paddingLeft: 20 }}
          >
            Previous
          </Button>
          <Button
            onClick={handleGoToTip}
            style={{ paddingRight: 20, paddingLeft: 20 }}
          >
            Tip
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={nextDisabled}
            style={{ paddingRight: 20, paddingLeft: 20 }}
          >
            Next
          </Button>
        </ButtonGroup>
        <Box
          style={{
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'flex-start',
            alignItems: 'center',
            gap: theme.spacing(1),
          }}
        >
          <Typography variant="caption">Rows per page</Typography>
          <ButtonGroup disableElevation variant="contained" size="small">
            <Button
              onClick={handleChange(10)}
              style={
                selectedButton === 10
                  ? { backgroundColor: theme.palette.primary.dark }
                  : { backgroundColor: theme.palette.primary.main }
              }
            >
              10
            </Button>
            <Button
              onClick={handleChange(20)}
              style={
                selectedButton === 20
                  ? { backgroundColor: theme.palette.primary.dark }
                  : { backgroundColor: theme.palette.primary.main }
              }
            >
              20
            </Button>
            <Button
              onClick={handleChange(50)}
              style={
                selectedButton === 50
                  ? { backgroundColor: theme.palette.primary.dark }
                  : { backgroundColor: theme.palette.primary.main }
              }
            >
              50
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </>
  );
}

export default BlockTable;
