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

import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import AccordionSummary from '@mui/material/AccordionSummary';

interface StyledAccordionProps {
  theme?: any;
  isHighlighted?: boolean;
  expanded?: boolean;
}

export const AccordionIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

export const StyledAccordion = styled(Accordion, {
  shouldForwardProp: (prop) => prop !== 'isHighlighted',
})<StyledAccordionProps>(({ theme, isHighlighted }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: isHighlighted
    ? '0px 5px 20px rgba(35, 11, 73, 0.15)'
    : '0px 2px 4px rgba(35, 11, 73, 0.05)',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  border: isHighlighted
    ? `2px solid rgba(255, 255, 255, 0.08)`
    : '2px solid rgba(255,255,255,0.04)',
  '&:hover': {
    backgroundColor: '#fafafc',
  },
  '&:before': {
    display: 'none',
  },
}));

export const StyledAccordionSummary = styled(AccordionSummary, {
  shouldForwardProp: (prop) => prop !== 'isHighlighted',
})<StyledAccordionProps>(({ theme, isHighlighted, expanded }) => ({
  backgroundColor: isHighlighted ? '#292532' : 'transparent',
  color: isHighlighted ? '#fff' : 'inherit',
  borderRadius: expanded ? `16px 16px 0 0` : theme.shape.borderRadius,
  transition: 'background-color 0.3s ease',
}));

export const TypographyData = styled(Typography)(({ theme }) => ({
  fontFamily: "'PoppinsRegular', sans-serif",
  color: theme.palette.text.primary,
  fontSize: '0.875rem',
  '& a': {
    color: theme.palette.primary.main,
  },
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: '10px 14px 28px rgba(35, 11, 73, 0.05)',
  border: '1px solid rgba(255,255,255,0.04)',
}));

export const GradientPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  boxShadow: '10px 14px 28px rgba(35, 11, 73, 0.05)',
  background: 'rgba(255, 255, 255, 0.80)',
  color: theme.palette.text.primary,
  backdropFilter: 'blur(15px)',
  borderRadius: '30px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const PageHeading = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h3.fontSize,
  textTransform: 'uppercase',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  letterSpacing: '1.5px',
  color: theme.palette.text.primary,
}));

export const DataTableCell = styled(TableCell)(() => ({
  fontFamily: "'PoppinsRegular', sans-serif",
}));

export const CodeBlock = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  maxHeight: '400px',
  overflowY: 'scroll',
}));

export const BoxHeading = styled(Box)(({ theme }) => ({
  backgroundColor: '#fafafa',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  fontFamily: "'PoppinsRegular', sans-serif",
  boxShadow: '0px 5px 5px rgba(35, 11, 73, 0.10)',
  margin: '10px 5px',
}));

export const BoxHeading2 = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const SubHeading = styled(Typography)(() => ({
  marginTop: '20px',
  marginBottom: '20px',
  textAlign: 'center',
}));

export const DialogContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
}));

export const GridHeadCell = styled(Box)(({ theme, className }) => ({
  // padding: theme.spacing(2),
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  gridArea: `${className}`,
}));

export const GridDataCell = styled(Box)(({ theme, className }) => ({
  // padding: theme.spacing(2),
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontFamily: "'PoppinsRegular', sans-serif",
  gridArea: `${className}`,
}));

export const TransparentButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  height: 56,
  borderColor: theme.palette.divider,
  color: 'white',
  background: theme.palette.divider,
  textTransform: 'uppercase',
}));

export const TransparentDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  background: 'none',
}));

export const TransparentBg = styled(Box)(
  ({ theme, height }: { theme: any; height?: any }) => ({
    height: height || '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: theme.spacing(1),
  })
);
