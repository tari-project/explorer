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
} from '../../components/StyledComponents';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetBlockByHeightOrHash } from '../../api/hooks/useBlocks';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { toHexString } from '../../utils/helpers';
import GridItem from './GridItem';

function Kernels({ blockHeight }: { blockHeight: string }) {
  const { data } = useGetBlockByHeightOrHash(blockHeight);
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme();

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const renderItems = data?.block.body.kernels.map(
    (content: any, index: number) => {
      const expandedPanel = `panel${index}`;
      const excessData = toHexString(content.excess.data);
      const hashData = toHexString(content.hash.data);
      const publicNonce = toHexString(content.excess_sig.public_nonce.data);
      const signature = toHexString(content.excess_sig.signature.data);

      const items = [
        {
          label: 'Features',
          value: content.features,
          copy: false,
        },
        {
          label: 'Fee',
          value: content.fee,
          copy: false,
        },
        {
          label: 'Lock Height',
          value: content.lock_height,
          copy: false,
        },
        {
          label: 'Excess',
          value: excessData,
          copy: true,
        },
        {
          label: 'Excess Sig',
          copy: false,
          children: [
            {
              label: 'Public Nonce',
              value: publicNonce,
              copy: true,
            },
            {
              label: 'Signature',
              value: signature,
              copy: true,
            },
          ],
        },
        { label: 'Hash', value: hashData, copy: true, header: false },
        {
          label: 'Version',
          value: content.version,
          copy: false,
        },
      ];

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
              {items.map((item, subIndex) => (
                <Fragment key={subIndex}>
                  {item.children ? (
                    <Fragment>
                      {GridItem(
                        theme,
                        item.label,
                        item.value,
                        item.copy,
                        index,
                        subIndex,
                        true
                      )}
                      {item.children.map((child, innerIndex) => (
                        <Fragment key={innerIndex}>
                          {GridItem(
                            theme,
                            child.label,
                            child.value,
                            child.copy,
                            index,
                            subIndex,
                            false
                          )}
                        </Fragment>
                      ))}
                    </Fragment>
                  ) : (
                    GridItem(
                      theme,
                      item.label,
                      item.value,
                      item.copy,
                      index,
                      subIndex,
                      true
                    )
                  )}
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
        Kernels ({data?.block.body.kernels.length || 0})
      </InnerHeading>
      {renderItems}
    </>
  );
}

export default Kernels;
