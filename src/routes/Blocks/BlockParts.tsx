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
import {
  useGetBlockByHeightOrHash,
  useGetPaginatedData,
} from '../../api/hooks/useBlocks';
import { useTheme } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import GenerateAccordion from './GenerateAccordion';
import FetchStatusCheck from '../../components/FetchStatusCheck';
import { inputItems } from './Data/Inputs';
import { outputItems } from './Data/Outputs';
import { kernelItems } from './Data/Kernels';

function Inputs({
  blockHeight,
  type,
  itemsPerPage,
}: {
  blockHeight: string;
  type: string;
  itemsPerPage: number;
}) {
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { data: blockData } = useGetBlockByHeightOrHash(blockHeight);
  const {
    data: paginatedData,
    isFetching,
    isError,
  } = useGetPaginatedData(blockHeight, type, startIndex, endIndex);
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme();

  let dataLength = '';
  switch (type) {
    case 'inputs':
      dataLength = 'inputs_length';
      break;
    case 'outputs':
      dataLength = 'outputs_length';
      break;
    case 'kernels':
      dataLength = 'kernels_length';
      break;
    default:
      break;
  }

  let title = '';
  switch (type) {
    case 'inputs':
      title = 'Input';
      break;
    case 'outputs':
      title = 'Output';
      break;
    case 'kernels':
      title = 'Kernel';
      break;
    default:
      break;
  }

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const totalItems = blockData?.body[dataLength] || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayedItems = paginatedData?.body.data;

  const renderItems = displayedItems?.map((content: any, index: number) => {
    const adjustedIndex = startIndex + 1 + index;
    const expandedPanel = `panel${adjustedIndex}`;
    let items: any[] = [];
    switch (type) {
      case 'inputs':
        items = inputItems(content);
        break;
      case 'outputs':
        items = outputItems(content);
        break;
      case 'kernels':
        items = kernelItems(content);
        break;
      default:
        break;
    }

    return (
      <GenerateAccordion
        items={items}
        adjustedIndex={adjustedIndex}
        expanded={expanded}
        handleChange={handleChange}
        expandedPanel={expandedPanel}
        tabName={title}
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

  if (isFetching || isError) {
    return (
      <FetchStatusCheck
        isLoading={isFetching}
        isError={isError}
        errorMessage="Error"
      />
    );
  }

  return (
    <>
      <InnerHeading>
        {title}s ({totalItems})
      </InnerHeading>
      {renderItems}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: theme.spacing(2),
        }}
      >
        {totalItems > itemsPerPage && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
            color="primary"
            variant="outlined"
            style={{
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(1),
            }}
          />
        )}
      </Box>
    </>
  );
}

export default Inputs;
