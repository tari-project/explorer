import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: theme.palette.text.primary,
  width: '100%',
  minHeight: '50px',
}));
