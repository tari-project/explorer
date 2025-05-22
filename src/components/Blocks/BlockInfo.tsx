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
import { Grid, Divider, Typography } from '@mui/material';
import { InnerHeading, TypographyData } from '@components/StyledComponents';
import { useGetBlockByHeightOrHash } from '@services/api/hooks/useBlocks';
import { toHexString, shortenString, formatTimestamp } from '@utils/helpers';
import CopyToClipboard from '@components/CopyToClipboard';
import { powCheck } from '@utils/helpers';

function BlockInfo({ blockHeight }: { blockHeight: any }) {
  const { data } = useGetBlockByHeightOrHash(blockHeight);
  const { header } = data ?? {};
  const items = [
    {
      label: 'Hash',
      value: toHexString(header?.hash?.data),
      copy: true,
    },
    {
      label: 'Proof of Work',
      value: powCheck(header?.pow?.pow_algo),
      copy: false,
    },
    {
      label: 'Height',
      value: header?.height,
      copy: false,
    },
    {
      label: 'Version',
      value: header?.version,
      copy: false,
    },
    {
      label: 'Timestamp',
      value: formatTimestamp(header?.timestamp),
      copy: false,
    },
    {
      label: 'Previous Hash',
      value: toHexString(header?.prev_hash?.data),
      copy: true,
    },
    {
      label: 'Nonce',
      value: header?.nonce,
      copy: false,
    },
    {
      label: 'Output Merkle Root',
      value: toHexString(header?.output_mr?.data),
      copy: true,
    },
    {
      label: 'Witness Merkle Root',
      value: toHexString(header?.validator_node_mr?.data),
      copy: true,
    },
    {
      label: 'Kernel Merkle Root',
      value: toHexString(header?.kernel_mr?.data),
      copy: true,
    },
    {
      label: 'Input Merkle Root',
      value: toHexString(header?.input_mr?.data),
      copy: true,
    },
    {
      label: 'Kernel MMR Size',
      value: header?.kernel_mmr_size,
      copy: false,
    },
    {
      label: 'Output MMR Size',
      value: header?.output_mmr_size,
      copy: false,
    },
    {
      label: 'Total Kernel Offset',
      value: toHexString(header?.total_kernel_offset?.data),
      copy: true,
    },
    {
      label: 'Total Script Offset',
      value: toHexString(header?.total_script_offset?.data),
      copy: true,
    },
  ];

  return (
    <>
      <InnerHeading>Header</InnerHeading>
      <Grid container spacing={2} pl={0} pr={0}>
        {items.map((item, index) =>
          item.copy ? (
            <Fragment key={index}>
              <Grid item xs={12} md={4} lg={4}>
                <Typography variant="h5">{item.label}</Typography>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <TypographyData>
                  {shortenString(item.value)}
                  <CopyToClipboard copy={item.value} />
                </TypographyData>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Fragment>
          ) : (
            <Fragment key={index}>
              <Grid item xs={12} md={4} lg={4}>
                <Typography variant="h5">{item.label}</Typography>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <TypographyData>{item.value}</TypographyData>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Fragment>
          )
        )}
      </Grid>
    </>
  );
}

export default BlockInfo;
