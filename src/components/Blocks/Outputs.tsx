import { useState, useEffect, useRef } from "react";
import type { TransactionOutput } from "@types";
import { TextField, Stack, Button, Alert } from "@mui/material";
import { useGetBlockByHeightOrHash, useGetPaginatedData } from "@services/api/hooks/useBlocks";
import Pagination from "@mui/material/Pagination";
import GenerateAccordion from "./GenerateAccordion";
import FetchStatusCheck from "@components/FetchStatusCheck";
import { outputItems } from "./Data/Outputs";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { useLocation } from "react-router-dom";
import { payrefSearch, commitmentSearch } from "@utils/searchFunctions";
import InnerHeading from "@components/InnerHeading";
import { validatePayRefQuery } from "@utils/validatePayRefQuery";

interface OutputsProps {
  blockHeight: string;
  type: string;
  itemsPerPage: number;
}

function Outputs({ blockHeight, type, itemsPerPage }: OutputsProps) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const payrefParams = params.get("payref");
  const commitmentParams = params.get("commitment");
  const foundRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { data: blockData } = useGetBlockByHeightOrHash(blockHeight);
  const { data: paginatedData, isFetching, isError } = useGetPaginatedData(blockHeight, type, startIndex, endIndex);
  const { data: outputsData } = useGetPaginatedData(blockHeight, "outputs", 0, blockData?.body?.outputs_length);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [searchValue, setSearchValue] = useState({
    query: "",
  });
  const [foundType, setFoundType] = useState<"payref" | "commitment" | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [foundPage, setFoundPage] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isInvalidQuery, setIsInvalidQuery] = useState(false);

  useEffect(() => {
    if (foundIndex !== null && foundIndex >= 0 && foundPage === page && expanded) {
      const el = foundRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const top = rect.top + scrollTop - 150;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, [foundIndex, foundPage, page, expanded]);

  const dataLength = "outputs_length";
  const title = "Output";

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
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

  const handleOutputsSearch = () => {
    setHasSearched(true);
    const query = searchValue.query.trim();

    if (!query) {
      setIsInvalidQuery(true);
      setFoundIndex(null);
      setFoundPage(null);
      setFoundType(null);
      return;
    }

    if (!validatePayRefQuery(query)) {
      setIsInvalidQuery(true);
      setFoundIndex(null);
      setFoundPage(null);
      setFoundType(null);
      return;
    }

    setIsInvalidQuery(false);
    if (outputsData?.body?.data) {
      let idx: number | null = null;
      let type: "payref" | "commitment" | null = null;

      // First try PayRef search
      idx = payrefSearch(query, outputsData.body.data);
      if (idx !== null && idx >= 0) {
        type = "payref";
      } else {
        // If PayRef not found, try commitment search
        idx = commitmentSearch(query, outputsData.body.data);
        if (idx !== null && idx >= 0) {
          type = "commitment";
        }
      }

      setFoundIndex(idx);
      setFoundType(type);

      if (idx !== null && idx >= 0) {
        const outputPage = Math.floor(idx / itemsPerPage) + 1;
        setFoundPage(outputPage);
        setPage(outputPage);

        setTimeout(() => {
          const indexOnPage = idx! % itemsPerPage;
          const foundPanel = `panel${(outputPage - 1) * itemsPerPage + 1 + indexOnPage}`;
          setExpanded(foundPanel);
        }, 0);
      } else {
        setFoundPage(null);
      }
    }
  };

  const handleClear = () => {
    setSearchValue({ query: "" });
    setFoundIndex(null);
    setFoundPage(null);
    setFoundType(null);
    setHasSearched(false);
    setExpanded(false);
    setShowSearch(false);
    setIsInvalidQuery(false);
  };

  useEffect(() => {
    if ((payrefParams || commitmentParams) && outputsData?.body?.data) {
      setShowSearch(true);
      const query = payrefParams || commitmentParams || "";
      setSearchValue({
        query,
      });

      let idx: number | null = null;
      let type: "payref" | "commitment" | null = null;

      if (payrefParams) {
        idx = payrefSearch(payrefParams, outputsData.body.data);
        if (idx !== null && idx >= 0) {
          type = "payref";
        }
      }

      if (idx === null && commitmentParams) {
        idx = commitmentSearch(commitmentParams, outputsData.body.data);
        if (idx !== null && idx >= 0) {
          type = "commitment";
        }
      }

      setFoundIndex(idx);
      setFoundType(type);

      if (idx !== null && idx >= 0) {
        const outputPage = Math.floor(idx / itemsPerPage) + 1;
        setFoundPage(outputPage);
        setPage(outputPage);

        setTimeout(() => {
          const indexOnPage = idx! % itemsPerPage;
          const foundPanel = `panel${(outputPage - 1) * itemsPerPage + 1 + indexOnPage}`;
          setExpanded(foundPanel);
        }, 0);
      } else {
        setFoundPage(null);
      }
      setHasSearched(true);
    }
  }, [payrefParams, commitmentParams, outputsData, itemsPerPage]);

  let renderItems;

  if (foundIndex !== null && foundIndex >= 0 && foundPage === page) {
    const indexOnPage = foundIndex % itemsPerPage;
    const content = displayedItems?.[indexOnPage];
    if (content) {
      const adjustedIndex = startIndex + 1 + indexOnPage;
      const expandedPanel = `panel${adjustedIndex}`;
      const items = outputItems(content);

      const tabName =
        foundType === "payref"
          ? `PayRef found in ${title}`
          : foundType === "commitment"
          ? `Commitment found in ${title}`
          : `Found in ${title}`;

      renderItems = (
        <div ref={foundRef}>
          <GenerateAccordion
            items={items}
            adjustedIndex={adjustedIndex}
            expanded={expanded}
            handleChange={handleChange}
            expandedPanel={expandedPanel}
            tabName={tabName}
            key={adjustedIndex}
            isHighlighted={true}
          />
        </div>
      );
    } else {
      renderItems = null;
    }
  } else {
    renderItems = displayedItems?.map((content: TransactionOutput, index: number) => {
      const adjustedIndex = startIndex + 1 + index;
      const expandedPanel = `panel${adjustedIndex}`;
      const items = outputItems(content);

      const shouldHighlight = foundIndex !== null && foundPage === page && foundIndex % itemsPerPage === index;

      return (
        <div ref={shouldHighlight ? foundRef : undefined} key={adjustedIndex}>
          <GenerateAccordion
            items={items}
            adjustedIndex={adjustedIndex}
            expanded={expanded}
            handleChange={handleChange}
            expandedPanel={expandedPanel}
            tabName={title}
            isHighlighted={shouldHighlight}
          />
        </div>
      );
    });
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (isFetching || isError) {
    return <FetchStatusCheck isLoading={isFetching} isError={isError} errorMessage="Error" />;
  }

  return (
    <>
      <InnerHeading
        icon={
          <IconButton
            aria-label={showSearch ? "Hide search" : "Show search"}
            onClick={() => setShowSearch((prev) => !prev)}
            size="large"
          >
            <SearchIcon color={showSearch ? "primary" : "inherit"} />
          </IconButton>
        }
      >
        {title}s ({totalItems})
      </InnerHeading>
      {showSearch && (
        <Stack gap={1} pb={2}>
          <TextField
            label="Search by Payment Reference or Commitment"
            placeholder="Enter 64-character PayRef or Commitment hash"
            name="query"
            variant="outlined"
            size="small"
            value={searchValue.query}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleOutputsSearch();
              }
            }}
            autoFocus
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={isInvalidQuery}
          />

          <Stack direction="row" gap={1} justifyContent="flex-end">
            <Button onClick={handleClear}>Clear</Button>
            <Button onClick={handleOutputsSearch} variant="contained">
              Search
            </Button>
          </Stack>
          {isInvalidQuery && (
            <Alert severity="error" sx={{ mt: 1 }} variant="standard">
              Please enter a valid 64-character hash.
            </Alert>
          )}
          {hasSearched && !isInvalidQuery && foundIndex === null && (
            <Alert severity="error" sx={{ mt: 1 }} variant="standard">
              No matching output found
            </Alert>
          )}
        </Stack>
      )}
      {renderItems}
      <Stack justifyContent="center" mt={2} direction="row">
        {totalItems > itemsPerPage && !(foundIndex !== null && foundIndex >= 0 && foundPage === page) && (
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
