import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const StyledContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.breakpoints.down('sm')
    ? theme.spacing(6)
    : theme.spacing(14),
  marginBottom: theme.breakpoints.down('sm')
    ? theme.spacing(4)
    : theme.spacing(12),
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"DrukHeavy", sans-serif',
  fontSize: theme.breakpoints.down('sm') ? 60 : 80,
  textTransform: 'uppercase',
}));

export const StyledSubTitle = styled(Typography)({
  textTransform: 'uppercase',
  letterSpacing: '1.3px',
});
