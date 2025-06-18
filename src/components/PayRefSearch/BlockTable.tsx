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

import { useState, Fragment } from 'react';
import { TypographyData } from '@components/StyledComponents';
import { Typography, Grid, Divider, Pagination } from '@mui/material';
import { toHexString, shortenString, formatTimestamp } from '@utils/helpers';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CopyToClipboard from '@components/CopyToClipboard';
import { useMainStore } from '@services/stores/useMainStore';
import InnerHeading from '@components/InnerHeading';

function BlockTable({ data }: { data: any }) {
  const [page, setPage] = useState(1);
  const isMobile = useMainStore((state) => state.isMobile);
  const totalItems = data?.length || 0;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  console.log('BlockTable data:', data);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  function Mobile() {
    const col1 = 4;
    const col2 = 8;

    return (
      <Grid container spacing={2} pl={0} pr={0}>
        {data.map((block: any, index: number) => {
          const height = block?.block_height || 'no data';
          const payref = block?.payment_reference_hex || 'no data';
          const minedTimestamp = block?.mined_timestamp || 'no data';
          const isSpent = block?.is_spent || false;
          const minValuePromise = block?.min_value_promise || 'no data';
          // const commitment = block?.commitment || 'no data';
          const blockHash = toHexString(block?.block_hash?.data) || 'no data';
          // const spentBlockHash =
          //   toHexString(block?.spent_block_hash?.data) || 'no data';

          return (
            <Fragment key={index}>
              <Grid item xs={12} key={index}>
                <Divider />
                <Grid container spacing={2} pl={0} pr={0} pb={2}>
                  <Grid item xs={col1}>
                    <Typography variant="body2">Height</Typography>
                  </Grid>
                  <Grid item xs={col2}>
                    <TypographyData>
                      <Link to={`/blocks/${height}`}>{height} </Link>
                    </TypographyData>
                  </Grid>

                  <Grid item xs={col1}>
                    <Typography variant="body2">Payment Reference</Typography>
                  </Grid>
                  <Grid item xs={col2}>
                    <TypographyData>
                      {shortenString(payref, 6, 6)}
                      <CopyToClipboard copy={payref} />
                    </TypographyData>
                  </Grid>

                  <Grid item xs={col1}>
                    <Typography variant="body2">Mined Timestamp</Typography>
                  </Grid>
                  <Grid item xs={col2}>
                    <TypographyData>
                      {formatTimestamp(minedTimestamp)}
                    </TypographyData>
                  </Grid>

                  <Grid item xs={col1}>
                    <Typography variant="body2">Spent</Typography>
                  </Grid>
                  <Grid item xs={col2}>
                    <TypographyData>{isSpent ? 'Yes' : 'No'}</TypographyData>
                  </Grid>

                  <Grid item xs={col1}>
                    <Typography variant="body2">Min Value Promise</Typography>
                  </Grid>
                  <Grid item xs={col2}>
                    <TypographyData>{minValuePromise}</TypographyData>
                  </Grid>

                  <Grid item xs={col1}>
                    <Typography variant="body2">Block Hash</Typography>
                  </Grid>
                  <Grid item xs={col2}>
                    <TypographyData>
                      {shortenString(blockHash, 6, 6)}
                      <CopyToClipboard copy={blockHash} />
                    </TypographyData>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Link to={`/blocks/${height}`}>
                    <Button variant="outlined" fullWidth>
                      View Block
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Fragment>
          );
        })}
      </Grid>
    );
  }

  function Desktop() {
    const col1 = 1;
    const col2 = 2;
    const col3 = 2;
    const col4 = 1;
    const col5 = 2;
    const col6 = 2;

    return (
      <>
        <Grid container spacing={2} pl={0} pr={0} pb={2} pt={2}>
          <Grid item xs={col1} md={col1} lg={col1}>
            <Typography variant="body2">Height</Typography>
          </Grid>
          <Grid item xs={col2} md={col2} lg={col2}>
            <Typography variant="body2">Payment Reference</Typography>
          </Grid>
          <Grid item xs={col3} md={col3} lg={col3}>
            <Typography variant="body2">Mined Timestamp</Typography>
          </Grid>
          <Grid item xs={col4} md={col4} lg={col4}>
            <Typography variant="body2">Spent</Typography>
          </Grid>
          <Grid item xs={col5} md={col5} lg={col5}>
            <Typography variant="body2">Min Value Promise</Typography>
          </Grid>
          <Grid item xs={col6} md={col6} lg={col6}>
            <Typography variant="body2">Block Hash</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} pl={0} pr={0} pb={2}>
          {data
            ?.slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((block: any, index: number) => {
              const height = block?.block_height || 'no data';
              const payref = block?.payment_reference_hex || 'no data';
              const minedTimestamp = block?.mined_timestamp || 'no data';
              const isSpent = block?.is_spent || false;
              const minValuePromise = block?.min_value_promise || 'no data';
              // const commitment = block?.commitment || 'no data';
              const blockHash =
                toHexString(block?.block_hash?.data) || 'no data';
              // const spentBlockHash =
              //   toHexString(block?.spent_block_hash?.data) || 'no data';

              return (
                <Fragment key={index}>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={col1} md={col1} lg={col1}>
                    <TypographyData>
                      <Link to={`/blocks/${height}`}>{height} </Link>
                    </TypographyData>
                  </Grid>
                  <Grid item xs={col2} md={col2} lg={col2}>
                    <TypographyData>
                      {shortenString(payref, 6, 6)}
                      <CopyToClipboard copy={payref} />
                    </TypographyData>
                  </Grid>
                  <Grid item xs={col3} md={col3} lg={col3}>
                    <TypographyData>
                      {formatTimestamp(minedTimestamp)}
                    </TypographyData>
                  </Grid>
                  <Grid item xs={col4} md={col4} lg={col4}>
                    <TypographyData>{isSpent ? 'Yes' : 'No'}</TypographyData>
                  </Grid>
                  <Grid item xs={col5} md={col5} lg={col5}>
                    <TypographyData>{minValuePromise}</TypographyData>
                  </Grid>
                  <Grid item xs={col6} md={col6} lg={col6}>
                    <TypographyData>
                      {shortenString(blockHash, 6, 6)}
                      <CopyToClipboard copy={blockHash} />
                    </TypographyData>
                  </Grid>
                </Fragment>
              );
            })}
        </Grid>
      </>
    );
  }

  return (
    <>
      <InnerHeading>Found in Block{totalItems > 1 && 's'}:</InnerHeading>
      {isMobile ? <Mobile /> : <Desktop />}
      <Divider />
      {totalItems > itemsPerPage && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          pt={2}
          pb={2}
        >
          <Pagination
            count={totalPages}
            color="primary"
            page={page}
            onChange={handleChange}
            siblingCount={0}
            boundaryCount={1}
            showFirstButton
            showLastButton
            variant="outlined"
          />
        </Box>
      )}
    </>
  );
}

export default BlockTable;
