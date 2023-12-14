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

function Inputs({ blockHeight }: { blockHeight: string }) {
  const { data } = useGetBlockByHeightOrHash(blockHeight);
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme();

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const renderItems = data?.block.body.inputs.map(
    (content: any, index: number) => {
      const expandedPanel = `panel${index}`;
      const items = [
        {
          label: 'Features',
          copy: false,
          children: [
            {
              label: 'Version',
              value: content.features.version,
              copy: false,
            },
            {
              label: 'Output Type',
              value: content.features.output_type,
              copy: false,
            },
            {
              label: 'Maturity',
              value: content.features.maturity,
              copy: false,
            },
          ],
        },
        {
          label: 'Commitment',
          value: toHexString(content.commitment.data),
          copy: true,
        },
        {
          label: 'Hash',
          value: toHexString(content.hash.data),
          copy: true,
        },
        {
          label: 'Script',
          value: content.script.data,
          copy: false,
        },
        {
          label: 'Input Data',
          value: toHexString(content.input_data.data),
          copy: true,
        },
        {
          label: 'Sender Offset Public Key',
          value: toHexString(content.sender_offset_public_key.data),
          copy: true,
        },
        {
          label: 'Script Signature',
          copy: false,
          children: [
            {
              label: 'Ephemeral commitment',
              value: toHexString(
                content.script_signature.ephemeral_commitment.data
              ),
              copy: true,
            },
            {
              label: 'Ephemeral pubkey',
              value: toHexString(
                content.script_signature.ephemeral_pubkey.data
              ),
              copy: true,
            },
            {
              label: 'u_a',
              value: toHexString(content.script_signature.u_a.data),
              copy: true,
            },
            {
              label: 'u_x',
              value: toHexString(content.script_signature.u_x.data),
              copy: true,
            },
            {
              label: 'u_y',
              value: toHexString(content.script_signature.u_y.data),
              copy: true,
            },
          ],
        },
        {
          label: 'Output Hash',
          value: toHexString(content.output_hash.data),
          copy: true,
        },
        {
          label: 'Covenant',
          value: content.covenant.data,
          copy: false,
        },
        {
          label: 'Version',
          value: content.version,
          copy: false,
        },
        {
          label: 'Encrypted Data',
          value: toHexString(content.encrypted_data.data),
          copy: true,
        },
        {
          label: 'Minimum Value Promise',
          value: content.minimum_value_promise,
          copy: false,
        },
        {
          label: 'Metadata Signature',
          copy: false,
          children: [
            {
              label: 'Ephemeral commitment',
              value: toHexString(
                content.metadata_signature.ephemeral_commitment.data
              ),
              copy: true,
            },
            {
              label: 'Ephemeral pubkey',
              value: toHexString(
                content.metadata_signature.ephemeral_pubkey.data
              ),
              copy: true,
            },
            {
              label: 'u_a',
              value: toHexString(content.metadata_signature.u_a.data),
              copy: true,
            },
            {
              label: 'u_x',
              value: toHexString(content.metadata_signature.u_x.data),
              copy: true,
            },
            {
              label: 'u_y',
              value: toHexString(content.metadata_signature.u_y.data),
              copy: true,
            },
          ],
        },
        {
          label: 'Rangeproof Hash',
          value: toHexString(content.rangeproof_hash.data),
          copy: true,
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
            <Typography variant="h6">Input {index}</Typography>
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
        Inputs ({data?.block.body.inputs.length || 0})
      </InnerHeading>
      {renderItems}
    </>
  );
}

export default Inputs;
