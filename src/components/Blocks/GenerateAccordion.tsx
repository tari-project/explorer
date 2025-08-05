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
import type { AccordionItem } from '@types';
import {
  StyledAccordion,
  StyledAccordionSummary,
} from '@components/StyledComponents';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GridItem from './GridItem';
import { IoCheckmarkCircle } from 'react-icons/io5';

function GenerateAccordion({
  items,
  adjustedIndex,
  expanded,
  handleChange,
  expandedPanel,
  tabName,
  isHighlighted,
}: {
  items: AccordionItem[];
  adjustedIndex: number;
  expanded: string | false;
  handleChange: (
    panel: string
  ) => (_: React.SyntheticEvent, isExpanded: boolean) => void;
  expandedPanel: string;
  tabName: string;
  isHighlighted?: boolean;
}) {
  return (
    <StyledAccordion
      expanded={expanded === `panel${adjustedIndex}`}
      onChange={handleChange(`panel${adjustedIndex}`)}
      elevation={0}
      key={adjustedIndex}
      isHighlighted={isHighlighted}
    >
      <StyledAccordionSummary
        expandIcon={
          <ExpandMoreIcon
            style={{
              color: isHighlighted ? '#fff' : 'inherit',
              transition: 'color 0.3s ease',
            }}
          />
        }
        aria-controls={expandedPanel + '-content'}
        id={expandedPanel + '-header'}
        isHighlighted={isHighlighted}
        expanded={expanded === `panel${adjustedIndex}`}
      >
        <Typography
          variant="h5"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {isHighlighted && <IoCheckmarkCircle size="22" color="#B0D636" />}{' '}
          {tabName} {adjustedIndex}
        </Typography>
      </StyledAccordionSummary>
      <AccordionDetails
        style={{
          padding: 0,
        }}
      >
        {items.map((item: AccordionItem, subIndex: number) => (
          <Fragment key={subIndex}>
            {item.children ? (
              <Fragment>
                {GridItem(
                  item.label,
                  Array.isArray(item.value)
                    ? item.value.join(',')
                    : item.value ?? '',
                  Boolean(item.copy),
                  adjustedIndex,
                  subIndex,
                  true
                )}
                {item.children.map(
                  (child: AccordionItem, innerIndex: number) => (
                    <Fragment key={innerIndex}>
                      {GridItem(
                        child.label,
                        Array.isArray(child.value)
                          ? child.value.join(',')
                          : child.value ?? '',
                        Boolean(child.copy),
                        adjustedIndex,
                        subIndex,
                        false
                      )}
                    </Fragment>
                  )
                )}
              </Fragment>
            ) : (
              GridItem(
                item.label,
                Array.isArray(item.value)
                  ? item.value.join(',')
                  : item.value ?? '',
                Boolean(item.copy),
                adjustedIndex,
                subIndex,
                true
              )
            )}
          </Fragment>
        ))}
      </AccordionDetails>
    </StyledAccordion>
  );
}

export default GenerateAccordion;
