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

import { Fragment } from 'react';
import { TypographyData } from '../../components/StyledComponents';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { shortenString } from '../../utils/helpers';
import CopyToClipboard from '../../components/CopyToClipboard';

function GridItem(
  theme: any,
  label: string,
  value: any,
  copy: boolean,
  index: number,
  subIndex: number,
  showDivider: boolean
) {
  return (
    <Fragment>
      <Grid item xs={12}>
        {showDivider && (
          <Divider
            style={{
              backgroundColor: theme.palette.background.paper,
            }}
          />
        )}
      </Grid>
      <Grid item xs={12} md={4} lg={4}>
        <Typography variant="body2">{label}</Typography>
      </Grid>
      <Grid item xs={12} md={8} lg={8}>
        <TypographyData>
          {copy ? (
            <Fragment>
              {shortenString(value)}
              <CopyToClipboard copy={value} key={`${index}-${subIndex}-copy`} />
            </Fragment>
          ) : (
            value
          )}
        </TypographyData>
      </Grid>
    </Fragment>
  );
}

export default GridItem;
