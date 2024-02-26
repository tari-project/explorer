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

import { useState } from 'react';
import { InnerHeading } from '../../components/StyledComponents';
import Box from '@mui/material/Box';
import { useGetBlockByHeightOrHash } from '../../api/hooks/useBlocks';
import { useTheme } from '@mui/material/styles';
import { toHexString } from '../../utils/helpers';
import Pagination from '@mui/material/Pagination';
import GenerateAccordion from './GenerateAccordion';

function Kernels({ blockHeight }: { blockHeight: string }) {
  const { data } = useGetBlockByHeightOrHash(blockHeight);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [page, setPage] = useState(1);
  const theme = useTheme();

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const itemsPerPage = 5;
  const totalItems = data?.block.body.kernels.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = data?.block.body.kernels.slice(startIndex, endIndex);

  const renderItems = displayedItems?.map((content: any, index: number) => {
    const adjustedIndex = startIndex + index;
    const expandedPanel = `panel${adjustedIndex}`;
    const excessData = toHexString(content.excess.data);
    const hashData = toHexString(content.hash.data);
    const publicNonce = toHexString(content.excess_sig.public_nonce.data);
    const signature = toHexString(content.excess_sig.signature.data);

    const items = [
      {
        label: 'Features',
        value: content.features,
        copy: false,
      },
      {
        label: 'Fee',
        value: content.fee,
        copy: false,
      },
      {
        label: 'Lock Height',
        value: content.lock_height,
        copy: false,
      },
      {
        label: 'Excess',
        value: excessData,
        copy: true,
      },
      {
        label: 'Excess Sig',
        copy: false,
        children: [
          {
            label: 'Public Nonce',
            value: publicNonce,
            copy: true,
          },
          {
            label: 'Signature',
            value: signature,
            copy: true,
          },
        ],
      },
      { label: 'Hash', value: hashData, copy: true, header: false },
      {
        label: 'Version',
        value: content.version,
        copy: false,
      },
    ];

    return (
      <GenerateAccordion
        items={items}
        adjustedIndex={adjustedIndex}
        expanded={expanded}
        handleChange={handleChange}
        theme={theme}
        expandedPanel={expandedPanel}
        tabName="Kernel"
        key={adjustedIndex}
      />
    );
  });

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <>
      <InnerHeading>Kernels ({totalItems})</InnerHeading>
      {renderItems}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: theme.spacing(2),
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
          color="primary"
        />
      </Box>
    </>
  );
}

export default Kernels;
