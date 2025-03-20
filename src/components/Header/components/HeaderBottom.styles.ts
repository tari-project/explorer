import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  color: theme.palette.text.primary,
  width: '100%',
}));

export const InnerBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
});
