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
import MempoolWidget from '@components/Mempool/MempoolWidget';
import VNTable from '@components/VNs/VNTable';
import BlockWidget from '@components/Blocks/BlockWidget';
import BlockTimes from '@components/Charts/BlockTimes';
import HashRates from '@components/Charts/HashRates';
import POWChart from '@components/Charts/POWChart';
import { useTheme } from '@mui/material/styles';
import InnerHeading from '@components/InnerHeading';

function BlockExplorerPage() {
  const theme = useTheme();
  return (
    <Grid
      container
      spacing={3}
      style={{
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(6),
      }}
    >
      <Grid
        item
        xs={12}
        md={12}
        lg={6}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        <GradientPaper>
          <InnerHeading>Recent Blocks</InnerHeading>
          <BlockWidget />
        </GradientPaper>
        <GradientPaper>
          <InnerHeading>Proof of Work Split</InnerHeading>
          <POWChart />
        </GradientPaper>
        <GradientPaper>
          <MempoolWidget />
        </GradientPaper>
      </Grid>
      <Grid
        item
        xs={12}
        md={12}
        lg={6}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        <GradientPaper>
          <InnerHeading>Block Times (Minutes)</InnerHeading>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <BlockTimes type="All" targetTime={2} />
            </Grid>
          </Grid>
        </GradientPaper>
        <GradientPaper>
          <InnerHeading>Hash Rates</InnerHeading>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <HashRates type="RandomX" />
            </Grid>
            <Grid item xs={12}>
              <HashRates type="Sha3" />
            </Grid>
            <Grid item xs={12}>
              <HashRates type="TariRandomX" />
            </Grid>
          </Grid>
        </GradientPaper>
        <GradientPaper>
          <VNTable />
        </GradientPaper>
      </Grid>
    </Grid>
  );
}

export default BlockExplorerPage;
