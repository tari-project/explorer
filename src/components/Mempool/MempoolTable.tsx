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

import { Fragment, useState } from 'react';
import { useAllBlocks } from '@services/api/hooks/useBlocks';
import { InnerHeading, TypographyData } from '@components/StyledComponents';
import {
  Typography,
  Grid,
  Divider,
  Alert,
  Pagination,
  Box,
  MenuItem,
  FormControl,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import FetchStatusCheck from '@components/FetchStatusCheck';
import { toHexString, shortenString } from '@utils/helpers';
import CopyToClipboard from '@components/CopyToClipboard';
import { useMainStore } from '@services/stores/useMainStore';

function MempoolTable() {
  const { data, isError, isLoading } = useAllBlocks();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMainStore((state) => state.isMobile);
  const totalItems = data?.mempool.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleNoOfItems = (event: SelectChangeEvent) => {
    const newValue = parseInt(event.target.value, 10);
    setItemsPerPage(newValue);
    setPage(1);
  };

  function isMempoolArray(mempool: any): mempool is Array<any> {
    return Array.isArray(mempool);
  }

  if (!isMempoolArray(data?.mempool)) {
    return (
      <Alert severity="error" variant="outlined">
        Invalid data format
      </Alert>
    );
  }

  function Mobile() {
    const col1 = 4;
    const col2 = 8;

    return (
      <Grid container spacing={2} pl={0} pr={0}>
        {data?.mempool
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((item: any, index: number) => (
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
                <Divider />
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
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((item: any, index: number) => (
              <Fragment key={index}>
                <Grid item xs={12}>
                  <Divider />
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
        <Alert severity="info" variant="outlined">
          Mempool is empty
        </Alert>
      ) : isMobile ? (
        <Mobile />
      ) : (
        <Desktop />
      )}

      {data?.mempool.length > 0 && !isLoading && !isError && (
        <>
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
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              showFirstButton
              showLastButton
              color="primary"
              variant="outlined"
            />
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
                  value={itemsPerPage.toString()}
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
      )}
    </>
  );
}

export default MempoolTable;
