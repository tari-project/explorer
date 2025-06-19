import { useState, useEffect } from 'react';
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
import { payrefSearch } from '@utils/searchFunctions';
import InnerHeading from '@components/InnerHeading';

interface OutputsProps {
  blockHeight: string;
  type: string;
  itemsPerPage: number;
  payref?: string;
}

function Outputs({ blockHeight, type, itemsPerPage }: OutputsProps) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const payrefParams = params.get('payref');

  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { data: blockData } = useGetBlockByHeightOrHash(blockHeight);
  const {
    data: paginatedData,
    isFetching,
    isError,
  } = useGetPaginatedData(blockHeight, type, startIndex, endIndex);
  const { data: outputsData } = useGetPaginatedData(
    blockHeight,
    'outputs',
    0,
    blockData?.body?.outputs_length
  );
  const [expanded, setExpanded] = useState<string | false>(false);
  const [searchValue, setSearchValue] = useState({
    payref: '',
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
    const value = event.target.value;
    setSearchValue({
      ...searchValue,
      [event.target.name]: value,
    });
    setFoundIndex(null);
  };

  const handleOutputsSearch = () => {
    setHasSearched(true);
    if (type === 'outputs' && outputsData?.body?.data) {
      const idx = payrefSearch(searchValue.payref, outputsData.body.data);
      setFoundIndex(idx);

      if (idx !== null && idx >= 0) {
        const outputPage = Math.floor(idx / itemsPerPage) + 1;
        setFoundPage(outputPage);
        setPage(outputPage);

        setTimeout(() => {
          const indexOnPage = idx % itemsPerPage;
          const foundPanel = `panel${
            (outputPage - 1) * itemsPerPage + 1 + indexOnPage
          }`;
          setExpanded(foundPanel);
        }, 0);
      } else {
        setFoundPage(null);
      }
    }
  };

  const handleClear = () => {
    setSearchValue({ payref: '' });
    setFoundIndex(null);
    setFoundPage(null);
    setHasSearched(false);
    setExpanded(false);
    setShowSearch(false);
  };

  useEffect(() => {
    if (type === 'outputs' && payrefParams && outputsData?.body?.data) {
      setShowSearch(true);
      setSearchValue({
        payref: payrefParams || '',
      });

      const idx = payrefSearch(payrefParams || '', outputsData.body.data);
      setFoundIndex(idx);

      if (idx !== null && idx >= 0) {
        const outputPage = Math.floor(idx / itemsPerPage) + 1;
        setFoundPage(outputPage);
        setPage(outputPage);

        setTimeout(() => {
          const indexOnPage = idx % itemsPerPage;
          const foundPanel = `panel${
            (outputPage - 1) * itemsPerPage + 1 + indexOnPage
          }`;
          setExpanded(foundPanel);
        }, 0);
      } else {
        setFoundPage(null);
      }
      setHasSearched(true);
    }
  }, [payrefParams, outputsData, type, itemsPerPage]);

  let renderItems;

  if (
    type === 'outputs' &&
    foundIndex !== null &&
    foundIndex >= 0 &&
    foundPage === page
  ) {
    const indexOnPage = foundIndex % itemsPerPage;
    const content = displayedItems?.[indexOnPage];
    if (content) {
      const adjustedIndex = startIndex + 1 + indexOnPage;
      const expandedPanel = `panel${adjustedIndex}`;
      const items = outputItems(content);

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
    renderItems = displayedItems?.map((content: any, index: number) => {
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

      const shouldHighlight =
        type === 'outputs' &&
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
    });
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
          type === 'outputs' ? (
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
      {type === 'outputs' && showSearch && (
        <Stack gap={1} pb={2}>
          <Typography variant="body2">
            Search by Payment Reference (PayRef)
          </Typography>
          <TextField
            label="Payment Reference"
            placeholder="Enter 64-character PayRef hash"
            name="payref"
            variant="outlined"
            size="small"
            value={searchValue.payref}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleOutputsSearch();
              }
            }}
            fullWidth
          />

          <Stack direction="row" gap={1} justifyContent="flex-end">
            <Button onClick={handleClear}>Clear</Button>
            <Button onClick={handleOutputsSearch} variant="contained">
              Search
            </Button>
          </Stack>
          {/* {foundIndex !== null && foundIndex >= 0 && (
            <Alert severity="success" sx={{ mt: 1 }} variant="standard">
              Found in output {foundIndex + 1}
            </Alert>
          )} */}
          {hasSearched && foundIndex === null && (
            <Alert severity="error" sx={{ mt: 1 }} variant="standard">
              No matching output found
            </Alert>
          )}
        </Stack>
      )}
      {renderItems}
      <Stack justifyContent="center" mt={2} direction="row">
        {totalItems > itemsPerPage &&
          !(
            type === 'outputs' &&
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

export default Outputs;
