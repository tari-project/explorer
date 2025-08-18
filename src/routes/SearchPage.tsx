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

import { GradientPaper } from "@components/StyledComponents";
import { Alert, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSearchByHashOrNumber } from "@services/api/hooks/useBlocks";
import FetchStatusCheck from "@components/FetchStatusCheck";
import PayRefTable from "@components/Search/PayRefTable";
import BlockTable from "@components/Search/BlockTable";
import useSearchStatusStore from "@services/stores/useSearchStatusStore";
import { useEffect } from "react";
import { validateHash } from "@utils/helpers";

interface SearchResultItem {
  search_type?: string;
  block_height?: string;
  block_hash?: { type?: string; data?: number[] };
  mined_timestamp?: string;
  payment_reference_hex?: string;
  is_spent?: boolean;
  min_value_promise?: number;
  commitment?: { data?: number[] };
  spent_block_hash?: { data?: number[] };
}

function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const hash = params.get("hash") || params.get("payref") || "";
  const isHash = validateHash(hash);

  const setStatus = useSearchStatusStore((state) => state.setStatus);
  const setMessage = useSearchStatusStore((state) => state.setMessage);

  const { data, isFetching: isLoading, isError, isSuccess, error } = useSearchByHashOrNumber(hash);

  useEffect(() => {
    setStatus({
      isLoading,
      isError,
      isSuccess,
    });
    if (isError) {
      setMessage("Not found");
    } else if (isSuccess) {
      setMessage("Block found");
    } else if (isLoading) {
      setMessage("Searching...");
    } else {
      setMessage("");
    }
  }, [isLoading, isError, isSuccess, setStatus, setMessage]);

  if (!isHash) {
    return (
      <Grid item xs={12} md={12} lg={12}>
        <GradientPaper>
          <Alert variant="outlined" severity="error">
            {" "}
            Invalid hash. Please enter a valid 64-character hexadecimal hash.
          </Alert>
        </GradientPaper>
      </Grid>
    );
  }

  if (isLoading || isError) {
    return (
      <Grid item xs={12} md={12} lg={12}>
        <GradientPaper>
          <FetchStatusCheck isError={isError} isLoading={isLoading} errorMessage={error?.message || "Not found"} />
        </GradientPaper>
      </Grid>
    );
  }

  const payrefItems = data?.items?.filter((item: SearchResultItem) => item.search_type === "Payref") || [];
  const hashItems = data?.items?.filter((item: SearchResultItem) => item.search_type === "#hash") || [];
  const heightItems = data?.items?.filter((item: SearchResultItem) => item.search_type === "#height") || [];
  const commitmentItems = data?.items?.filter((item: SearchResultItem) => item.search_type === "Commitment") || [];

  if (payrefItems.length === 1) {
    const blockHeight = payrefItems[0].block_height;
    window.location.replace(`/blocks/${blockHeight}?payref=${hash}`);
  }
  if (hashItems.length === 1) {
    const blockHeight = hashItems[0].block_height;
    window.location.replace(`/blocks/${blockHeight}`);
  }
  if (heightItems.length === 1) {
    const blockHeight = heightItems[0].block_height;
    window.location.replace(`/blocks/${blockHeight}`);
  }
  if (commitmentItems.length === 1) {
    const blockHeight = commitmentItems[0].block_height;
    window.location.replace(`/blocks/${blockHeight}?commitment=${hash}`);
  }

  return (
    <Grid item xs={12} md={12} lg={12}>
      <GradientPaper>
        {data?.items && data.items.length > 0 ? (
          <>
            {payrefItems.length > 0 && (
              <>
                <PayRefTable data={payrefItems} />
              </>
            )}
            {hashItems.length > 0 && (
              <>
                <BlockTable data={hashItems} />
              </>
            )}
            {heightItems.length > 0 && (
              <>
                <BlockTable data={heightItems} />
              </>
            )}
            {commitmentItems.length > 0 && (
              <>
                <BlockTable data={commitmentItems} />
              </>
            )}
          </>
        ) : (
          <Alert variant="outlined" severity="error">
            No results found for the provided hash.
          </Alert>
        )}
      </GradientPaper>
    </Grid>
  );
}

export default SearchPage;
