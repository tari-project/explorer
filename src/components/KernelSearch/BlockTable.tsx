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

import { useState, Fragment } from "react";
import { TypographyData } from "@components/StyledComponents";
import { Typography, Grid, Divider, Pagination } from "@mui/material";
import { toHexString, shortenString } from "@utils/helpers";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CopyToClipboard from "@components/CopyToClipboard";
import { useMainStore } from "@services/stores/useMainStore";
import InnerHeading from "@components/InnerHeading";
import { KernelSearchItem } from "@types";

function BlockTable({ data }: { data: KernelSearchItem[] | undefined }) {
  const [page, setPage] = useState(1);
  const isMobile = useMainStore((state) => state.isMobile);
  const totalItems = data?.length || 0;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  console.log("BlockTable data:", data);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  function Mobile() {
    const col1 = 4;
    const col2 = 8;

    return (
      <Grid container spacing={2} pl={0} pr={0}>
        {data?.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((block: KernelSearchItem, index: number) => {
          const height = block?.block_height || "no data";
          const hash = block?.hash?.data || "no data";

          return (
            <Fragment key={index}>
              <Grid item xs={col1}>
                <Typography variant="body2">Height</Typography>
              </Grid>
              <Grid item xs={col2}>
                <TypographyData>
                  <Link to={`/blocks/${height}`}>{parseInt(height).toLocaleString("en-US")}</Link>
                </TypographyData>
              </Grid>

              <Grid item xs={col1}>
                <Typography variant="body2">Hash</Typography>
              </Grid>
              <Grid item xs={col2}>
                <TypographyData>
                  {shortenString(toHexString(hash), 6, 6)}
                  <CopyToClipboard copy={toHexString(hash)} />
                </TypographyData>
              </Grid>

              <Grid item xs={12} pb={2}>
                <Link to={`/blocks/${height}`}>
                  <Button variant="outlined" fullWidth>
                    View Block
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Fragment>
          );
        })}
      </Grid>
    );
  }

  function Desktop() {
    const col1 = 3;
    const col4 = 9;

    return (
      <>
        <Grid container spacing={2} pl={0} pr={0} pb={2} pt={2}>
          <Grid item xs={col1} md={col1} lg={col1}>
            <Typography variant="body2">Height</Typography>
          </Grid>
          <Grid item xs={col4} md={col4} lg={col4}>
            <Typography variant="body2">Hash</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} pl={0} pr={0} pb={2}>
          {data?.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((block: KernelSearchItem, index: number) => {
            const height = block?.block_height || "no data";
            const hash = block?.hash?.data || "no data";

            return (
              <Fragment key={index}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={col1} md={col1} lg={col1}>
                  <TypographyData>
                    <Link to={`/blocks/${height}`}>{parseInt(height).toLocaleString("en-US")}</Link>
                  </TypographyData>
                </Grid>
                <Grid item xs={col4} md={col4} lg={col4}>
                  <TypographyData>
                    {shortenString(toHexString(hash))}
                    <CopyToClipboard copy={toHexString(hash)} />
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
      <InnerHeading>Found in Block{totalItems > 1 && "s"}:</InnerHeading>
      {isMobile ? <Mobile /> : <Desktop />}
      <Divider />
      {totalItems > itemsPerPage && (
        <Box display="flex" justifyContent="center" alignItems="center" pt={2} pb={2}>
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
