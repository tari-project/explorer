import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const DesktopBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: theme.spacing(3),
}));
