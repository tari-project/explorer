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
import {
  Typography,
  Grid,
  Divider,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  MenuItem,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  toHexString,
  shortenString,
  formatTimestamp,
} from '../../utils/helpers';
import { Link } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import CopyToClipboard from '../../components/CopyToClipboard';
import { useMediaQuery } from '@mui/material';

function BlockTable() {
  const { data: tipData } = useAllBlocks();
  const tip = tipData?.tipInfo?.metadata?.best_block_height;
  const [blocksPerPage, setBlocksPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [firstHeight, setFirstHeight] = useState(tip || 0);
  const { data } = useGetBlocksByParam(firstHeight, blocksPerPage);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
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

  const handleNoOfItems = (event: SelectChangeEvent) => {
    const newValue = parseInt(event.target.value, 10);
    setBlocksPerPage(newValue);
    setPage(1);
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
                {shortenString(toHexString(block.hash.data), 6, 6)}
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
              <Link to={`/blocks/${block.height}`}>
                <Button variant="outlined" fullWidth>
                  View Block
                </Button>
              </Link>
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
        <Typography variant="h6">
          Showing blocks {firstHeight - blocksPerPage + 1} - {firstHeight}
        </Typography>
        <ButtonGroup
          variant="outlined"
          disableElevation
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
          <Typography variant="h6">Rows per page</Typography>
          <FormControl size="small">
            <Select
              labelId="rows-per-page"
              id="rows-per-page"
              value={blocksPerPage.toString()}
              onChange={handleNoOfItems}
              variant="outlined"
              style={{
                fontSize: theme.typography.h6.fontSize,
              }}
            >
              <MenuItem value={'10'}>10</MenuItem>
              <MenuItem value={'20'}>20</MenuItem>
              <MenuItem value={'50'}>50</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  );
}

export default BlockTable;
