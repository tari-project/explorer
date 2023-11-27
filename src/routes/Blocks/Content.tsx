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

import { useState, Fragment } from 'react';
import {
  InnerHeading,
  StyledAccordion,
  TypographyData,
} from '../../components/StyledComponents';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetBlockByHeight } from '../../api/hooks/useBlocks';
import { styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { toHexString, shortenString } from '../../utils/helpers';
import CopyToClipboard from '../../components/CopyToClipboard';

function Kernels({
  blockHeight,
  heading,
}: {
  blockHeight: number;
  heading: string;
}) {
  const { data } = useGetBlockByHeight(blockHeight);
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme();

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const renderItems = data?.block.body.kernels.map(
    (kernel: any, index: number) => {
      const expandedPanel = `panel${index}`;
      const excessData = toHexString(kernel.excess.data);
      const hashData = toHexString(kernel.hash.data);
      const publicNonce = toHexString(kernel.excess_sig.public_nonce.data);
      const signature = toHexString(kernel.excess_sig.signature.data);

      return (
        <StyledAccordion
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
          elevation={0}
          key={index}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={expandedPanel + '-content'}
            id={expandedPanel + '-header'}
          >
            <Typography variant="h6">Kernel {index}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {[
                {
                  label: 'Features:',
                  value: kernel.features,
                  copy: false,
                  header: false,
                },
                {
                  label: 'Fee:',
                  value: kernel.fee,
                  copy: false,
                  header: false,
                },
                {
                  label: 'Lock Height:',
                  value: kernel.lock_height,
                  copy: false,
                  header: false,
                },
                {
                  label: 'Excess:',
                  value: excessData,
                  copy: true,
                  header: true,
                },
                {
                  label: 'Excess Sig:',
                  value: 'Replace',
                  copy: false,
                  header: false,
                },
                {
                  label: 'Public Nonce:',
                  value: publicNonce,
                  copy: true,
                  header: false,
                },
                {
                  label: 'Signature:',
                  value: signature,
                  copy: true,
                  header: false,
                },
                { label: 'Hash:', value: hashData, copy: true, header: false },
                {
                  label: 'Version:',
                  value: kernel.version,
                  copy: false,
                  header: false,
                },
              ].map((item, subIndex) => (
                <Fragment key={subIndex}>
                  <Grid item xs={12}>
                    <Divider color={theme.palette.background.paper} />
                  </Grid>
                  <Grid item xs={12} md={3} lg={3}>
                    <Typography variant="body2">{item.label}</Typography>
                  </Grid>
                  <Grid item xs={12} md={9} lg={9}>
                    <TypographyData>
                      {item.copy ? (
                        <>
                          {shortenString(item.value)}
                          <CopyToClipboard
                            copy={item.value}
                            key={`${index}-${subIndex}-copy`}
                          />
                        </>
                      ) : (
                        item.value
                      )}
                    </TypographyData>
                  </Grid>
                </Fragment>
              ))}
            </Grid>
          </AccordionDetails>
        </StyledAccordion>
      );
    }
  );

  return (
    <>
      <InnerHeading>
        {heading} ({data?.block.body.kernels.length || 0})
      </InnerHeading>
      {renderItems}
    </>
  );
}

export default Kernels;
