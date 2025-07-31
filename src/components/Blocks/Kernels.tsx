import { useState, useEffect } from 'react';
import type {
  TransactionInput,
  TransactionOutput,
  TransactionKernel,
  AccordionItem,
} from '@types';
import { TextField, Stack, Button, Alert, Typography } from '@mui/material';
import {
  useGetBlockByHeightOrHash,
  useGetPaginatedData,
} from '@services/api/hooks/useBlocks';
import Pagination from '@mui/material/Pagination';
import GenerateAccordion from './GenerateAccordion';
import FetchStatusCheck from '@components/FetchStatusCheck';
import { inputItems } from './Data/Inputs';
import { outputItems } from './Data/Outputs';
import { kernelItems } from './Data/Kernels';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { useLocation } from 'react-router-dom';
import { kernelSearch } from '@/utils/searchFunctions';
import InnerHeading from '@components/InnerHeading';

interface KernelsProps {
  blockHeight: string;
  type: string;
  itemsPerPage: number;
  nonce?: string;
  signature?: string;
}

function Kernels({ blockHeight, type, itemsPerPage }: KernelsProps) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nonceParams = params.get('nonce');
  const signatureParams = params.get('signature');

  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { data: blockData } = useGetBlockByHeightOrHash(blockHeight);
  const {
    data: paginatedData,
    isFetching,
    isError,
  } = useGetPaginatedData(blockHeight, type, startIndex, endIndex);
  const { data: allKernelsData } = useGetPaginatedData(
    blockHeight,
    'kernels',
    0,
    blockData?.body?.kernels_length
  );
  const [expanded, setExpanded] = useState<string | false>(false);
  const [searchValue, setSearchValue] = useState({
    nonce: '',
    signature: '',
  });
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [foundPage, setFoundPage] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase().trim();
    setSearchValue({
      ...searchValue,
      [event.target.name]: value,
    });
    setFoundIndex(null);
  };

  const handleKernelSearch = () => {
    setHasSearched(true);
    if (type === 'kernels' && allKernelsData?.body?.data) {
      const idx = kernelSearch(
        searchValue.nonce,
        searchValue.signature,
        allKernelsData.body.data
      );
      setFoundIndex(idx);

      if (idx !== null && idx >= 0) {
        const kernelPage = Math.floor(idx / itemsPerPage) + 1;
        setFoundPage(kernelPage);
        setPage(kernelPage);

        setTimeout(() => {
          const indexOnPage = idx % itemsPerPage;
          const foundPanel = `panel${
            (kernelPage - 1) * itemsPerPage + 1 + indexOnPage
          }`;
          setExpanded(foundPanel);
        }, 0);
      } else {
        setFoundPage(null);
      }
    }
  };

  const handleClear = () => {
    setSearchValue({ nonce: '', signature: '' });
    setFoundIndex(null);
    setFoundPage(null);
    setHasSearched(false);
    setExpanded(false);
    setShowSearch(false);
  };

  useEffect(() => {
    if (
      type === 'kernels' &&
      (nonceParams || signatureParams) &&
      allKernelsData?.body?.data
    ) {
      setShowSearch(true);
      setSearchValue({
        nonce: nonceParams || '',
        signature: signatureParams || '',
      });

      const idx = kernelSearch(
        nonceParams || '',
        signatureParams || '',
        allKernelsData.body.data
      );
      setFoundIndex(idx);

      if (idx !== null && idx >= 0) {
        const kernelPage = Math.floor(idx / itemsPerPage) + 1;
        setFoundPage(kernelPage);
        setPage(kernelPage);

        setTimeout(() => {
          const indexOnPage = idx % itemsPerPage;
          const foundPanel = `panel${
            (kernelPage - 1) * itemsPerPage + 1 + indexOnPage
          }`;
          setExpanded(foundPanel);
        }, 0);
      } else {
        setFoundPage(null);
      }
      setHasSearched(true);
    }
  }, [nonceParams, signatureParams, allKernelsData, type, itemsPerPage]);

  let renderItems;

  if (
    type === 'kernels' &&
    foundIndex !== null &&
    foundIndex >= 0 &&
    foundPage === page
  ) {
    const indexOnPage = foundIndex % itemsPerPage;
    const content = displayedItems?.[indexOnPage];
    if (content) {
      const adjustedIndex = startIndex + 1 + indexOnPage;
      const expandedPanel = `panel${adjustedIndex}`;
      const items = kernelItems(content);

      renderItems = (
        <GenerateAccordion
          items={items}
          adjustedIndex={adjustedIndex}
          expanded={expanded}
          handleChange={handleChange}
          expandedPanel={expandedPanel}
          tabName={`Found in ${title}`}
          key={adjustedIndex}
          isHighlighted={true}
        />
      );
    } else {
      renderItems = null;
    }
  } else {
    renderItems = displayedItems?.map(
      (
        content: TransactionInput | TransactionOutput | TransactionKernel,
        index: number
      ) => {
        const adjustedIndex = startIndex + 1 + index;
        const expandedPanel = `panel${adjustedIndex}`;
        let items: AccordionItem[] = [];
        switch (type) {
          case 'inputs':
            items = inputItems(content as TransactionInput);
            break;
          case 'outputs':
            items = outputItems(content as TransactionOutput);
            break;
          case 'kernels':
            items = kernelItems(content as TransactionKernel);
            break;
          default:
            break;
        }

        const shouldHighlight =
          type === 'kernels' &&
          foundIndex !== null &&
          foundPage === page &&
          foundIndex % itemsPerPage === index;

        return (
          <GenerateAccordion
            items={items}
            adjustedIndex={adjustedIndex}
            expanded={expanded}
            handleChange={handleChange}
            expandedPanel={expandedPanel}
            tabName={title}
            key={adjustedIndex}
            isHighlighted={shouldHighlight}
          />
        );
      }
    );
  }

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
      <InnerHeading
        icon={
          type === 'kernels' ? (
            <IconButton
              aria-label={showSearch ? 'Hide search' : 'Show search'}
              onClick={() => setShowSearch((prev) => !prev)}
              size="large"
            >
              <SearchIcon color={showSearch ? 'primary' : 'inherit'} />
            </IconButton>
          ) : null
        }
      >
        {title}s ({totalItems})
      </InnerHeading>
      {type === 'kernels' && showSearch && (
        <Stack gap={1} pb={2}>
          <Typography variant="body2">
            Search for a kernel by nonce or signature
          </Typography>
          <TextField
            label="Nonce"
            placeholder="Search by nonce"
            name="nonce"
            variant="outlined"
            size="small"
            value={searchValue.nonce}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleKernelSearch();
              }
            }}
            fullWidth
          />
          <TextField
            label="Signature"
            placeholder="Search by signature"
            name="signature"
            variant="outlined"
            size="small"
            value={searchValue.signature}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleKernelSearch();
              }
            }}
            fullWidth
          />

          <Stack direction="row" gap={1} justifyContent="flex-end">
            <Button onClick={handleClear}>Clear</Button>
            <Button onClick={handleKernelSearch} variant="contained">
              Search
            </Button>
          </Stack>
          {/* {foundIndex !== null && foundIndex >= 0 && (
            <Alert severity="success" sx={{ mt: 1 }} variant="standard">
              Found in kernel {foundIndex + 1}
            </Alert>
          )} */}
          {hasSearched && foundIndex === null && (
            <Alert severity="error" sx={{ mt: 1 }} variant="standard">
              No matching kernel found
            </Alert>
          )}
        </Stack>
      )}
      {renderItems}
      <Stack justifyContent="center" mt={2} direction="row">
        {totalItems > itemsPerPage &&
          !(
            type === 'kernels' &&
            foundIndex !== null &&
            foundIndex >= 0 &&
            foundPage === page
          ) && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              showFirstButton
              showLastButton
              color="primary"
              variant="outlined"
            />
          )}
      </Stack>
    </>
  );
}

export default Kernels;
