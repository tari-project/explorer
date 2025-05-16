import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const StyledBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
});

export const ValueTypography = styled(Typography)<{ lowerCase?: boolean }>(
  ({ lowerCase }) => ({
    textTransform: lowerCase ? 'lowercase' : 'uppercase',
    fontFamily: 'DrukHeavy',
    fontSize: '22px',
    color: '#fff',
    textAlign: 'center',
    lineHeight: '0.9',
  })
);

export const LabelTypography = styled(Typography)({
  fontSize: '11px',
  color: '#cacaca',
  textAlign: 'center',
  lineHeight: '1.2',
});
