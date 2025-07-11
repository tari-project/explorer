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

import MainLayout from '@theme/MainLayout';
import PageLayout from '@theme/PageLayout';
import BlockExplorerPage from '@routes/BlockExplorerPage';
import BlocksPage from '@routes/BlocksPage';
import MempoolPage from '@routes/MempoolPage';
import KernelSearch from '@routes/KernelSearchPage';
import VNPage from '@routes/VNPage';
import BlockPage from '@routes/BlockPage';
import { Routes, Route } from 'react-router-dom';
import BlockHeader from '@components/Blocks/BlockHeader';
import KernelHeader from '@components/KernelSearch/KernelHeader';
import { useMediaQuery, useTheme } from '@mui/material';
import { useMainStore } from '@services/stores/useMainStore';
import { useEffect } from 'react';
import SearchPage from '@routes/SearchPage';
import SearchPageHeader from '@components/Search/SearchPageHeader';

function App() {
  const theme = useTheme();
  const setIsMobile = useMainStore((state) => state.setIsMobile);
  const isMobileQuery = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setIsMobile(isMobileQuery);
  }, [isMobileQuery, setIsMobile]);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<BlockExplorerPage />} />
          {/* <Route path="*" element={<ErrorPage />} /> */}
        </Route>
        <Route path="vns" element={<PageLayout title="Validator Nodes" />}>
          <Route index element={<VNPage />} />
        </Route>
        <Route path="blocks" element={<PageLayout title="Blocks" />}>
          <Route index element={<BlocksPage />} />
        </Route>
        <Route
          path="blocks/:blockHeight"
          element={<PageLayout customHeader={<BlockHeader />} />}
        >
          <Route index element={<BlockPage />} />
        </Route>
        <Route
          path="kernel_search"
          element={<PageLayout customHeader={<KernelHeader />} />}
        >
          <Route index element={<KernelSearch />} />
        </Route>
        <Route
          path="search"
          element={<PageLayout customHeader={<SearchPageHeader />} />}
        >
          <Route index element={<SearchPage />} />
        </Route>
        <Route path="mempool" element={<PageLayout title="Mempool" />}>
          <Route index element={<MempoolPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
