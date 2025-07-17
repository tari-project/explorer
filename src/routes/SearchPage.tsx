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

import { GradientPaper } from '@components/StyledComponents';
import { Alert, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
  useSearchByPayref,
  useGetBlockByHeightOrHash,
} from '@services/api/hooks/useBlocks';
import FetchStatusCheck from '@components/FetchStatusCheck';
import PayRefTable from '@components/Search/PayRefTable';
import BlockTable from '@components/Search/BlockTable';
import useSearchStatusStore from '@services/stores/useSearchStatusStore';
import { useEffect } from 'react';
import { validateHash } from '@utils/helpers';

function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const hash = params.get('hash') || params.get('payref') || '';
  const isHash = validateHash(hash);

  const setStatus = useSearchStatusStore((state) => state.setStatus);
  const setMessage = useSearchStatusStore((state) => state.setMessage);

  let payrefData, isPayrefLoading, isPayrefError, payrefError, isPayrefSuccess;
  let blockData, isBlockLoading, isBlockError, blockError, isBlockSuccess;

  if (isHash) {
    ({
      data: payrefData,
      isFetching: isPayrefLoading,
      isError: isPayrefError,
      isSuccess: isPayrefSuccess,
      error: payrefError,
    } = useSearchByPayref(hash));

    ({
      data: blockData,
      isFetching: isBlockLoading,
      isError: isBlockError,
      isSuccess: isBlockSuccess,
      error: blockError,
    } = useGetBlockByHeightOrHash(hash));
  }

  let showFetchStatusCheck = true;
  let isLoading = true;
  let isError = false;
  let isSuccess = false;

  if (!isHash) {
    showFetchStatusCheck = false;
    isLoading = false;
    isError = true;
    isSuccess = false;
  } else if (isPayrefLoading) {
    showFetchStatusCheck = true;
    isLoading = true;
    isError = false;
    isSuccess = false;
  } else if (isPayrefSuccess && payrefData?.items.length > 0) {
    showFetchStatusCheck = false;
    isLoading = false;
    isError = false;
    isSuccess = true;

    // If payref search returns exactly one result, redirect to block with payref
    if (payrefData.items.length === 1) {
      const blockHeight = payrefData.items[0].block_height;
      window.location.replace(`/blocks/${blockHeight}?payref=${hash}`);
    }
  } else if (
    isPayrefError ||
    (payrefData?.items.length === 0 && !isBlockLoading)
  ) {
    if (isBlockLoading) {
      showFetchStatusCheck = true;
      isLoading = true;
      isError = false;
      isSuccess = false;
    } else if (isBlockError || !blockData) {
      showFetchStatusCheck = true;
      isLoading = false;
      isError = true;
      isSuccess = false;
    } else if (isBlockSuccess && blockData) {
      showFetchStatusCheck = false;
      isLoading = false;
      isError = false;
      isSuccess = true;

      // If payref search returns nothing, but block search succeeds, redirect to block
      window.location.replace(`/blocks/${blockData.header.height}`);
    }
  } else {
    showFetchStatusCheck = false;
    isLoading = true;
    isError = false;
    isSuccess = false;
  }

  useEffect(() => {
    setStatus({
      isLoading,
      isError,
      isSuccess,
    });
    if (isError) {
      setMessage('Not found');
    } else if (isSuccess) {
      setMessage('Block found');
    } else if (isLoading) {
      setMessage('Searching...');
    } else {
      setMessage('');
    }
  }, [isLoading, isError, payrefError, isSuccess, blockError, setStatus]);

  if (!isHash) {
    return (
      <Grid item xs={12} md={12} lg={12}>
        <GradientPaper>
          <Alert variant="outlined" severity="error">
            {' '}
            Invalid hash. Please enter a valid 64-character hexadecimal hash.
          </Alert>
        </GradientPaper>
      </Grid>
    );
  }

  if (showFetchStatusCheck || isLoading) {
    return (
      <Grid item xs={12} md={12} lg={12}>
        <GradientPaper>
          <FetchStatusCheck
            isError={isError}
            isLoading={isLoading}
            errorMessage={
              payrefError?.message || blockError?.message || 'Not found'
            }
          />
        </GradientPaper>
      </Grid>
    );
  }

  return (
    <Grid item xs={12} md={12} lg={12}>
      <GradientPaper>
        {payrefData?.items.length > 0 && (
          <PayRefTable data={payrefData?.items || []} />
        )}
        {blockData?.height && <BlockTable data={blockData || []} />}
      </GradientPaper>
    </Grid>
  );
}

export default SearchPage;
