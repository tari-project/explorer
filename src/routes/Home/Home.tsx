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

import { GradientPaper } from '../../components/StyledComponents';
import { useTheme } from '@mui/material/styles';
import { Grid, Container } from '@mui/material';
import BlockTimes from '../Charts/BlockTimes';
import HashRates from '../Charts/HashRates';
import ProofOfWork from '../Charts/ProofOfWork';

function Home() {
  const theme = useTheme();
  return (
    <Container maxWidth="xl">
      <Grid
        container
        spacing={3}
        style={{
          paddingTop: theme.spacing(4),
          paddingBottom: theme.spacing(6),
        }}
      >
        <Grid item xs={12} md={12} lg={6}>
          <GradientPaper>
            <BlockTimes />
          </GradientPaper>
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <GradientPaper>
            <HashRates />
          </GradientPaper>
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <GradientPaper>
            <ProofOfWork />
          </GradientPaper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
