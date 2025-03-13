import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const StyledBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 0,
  minWidth: '108px',
});

export const ValueTypography = styled(Typography)<{ lowerCase?: boolean }>(
  ({ lowerCase }) => ({
    textTransform: lowerCase ? 'lowercase' : 'uppercase',
    fontFamily: 'DrukHeavy',
    fontSize: '30px',
    color: '#fff',
    textAlign: 'center',
    transition: 'font-size 0.3s ease-in-out',
  })
);

export const LabelTypography = styled(Typography)({
  fontSize: '11px',
  color: '#fff',
  textAlign: 'center',
});
