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
import { Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
  useSearchByPayref,
  useGetBlockByHeightOrHash,
} from '@services/api/hooks/useBlocks';
import FetchStatusCheck from '@components/FetchStatusCheck';
import PayRefTable from '@components/Search/PayRefTable';
import BlockTable from '@components/Search/BlockTable';

function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const hash = params.get('hash') || '';

  const {
    data: payrefData,
    isFetching: isPayrefLoading,
    isError: isPayrefError,
    error: payrefError,
  } = useSearchByPayref(hash);

  const {
    data: blockData,
    isFetching: isBlockLoading,
    isError: isBlockError,
    error: blockError,
  } = useGetBlockByHeightOrHash(hash);

  let showFetchStatusCheck = true;
  let isLoading = true;
  let isError = false;

  if (isPayrefLoading) {
    showFetchStatusCheck = true;
    isLoading = true;
    isError = false;
  } else if (
    isPayrefError ||
    (payrefData?.items.length === 0 && !isBlockLoading)
  ) {
    if (isBlockLoading) {
      showFetchStatusCheck = true;
      isLoading = true;
      isError = false;
    } else if (isBlockError || !blockData) {
      showFetchStatusCheck = true;
      isLoading = false;
      isError = true;
    }
  } else {
    showFetchStatusCheck = false;
    isLoading = true;
    isError = false;
  }

  if (showFetchStatusCheck) {
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
