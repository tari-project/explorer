import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const StyledContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(4),
  },
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"DrukHeavy", sans-serif',
  fontSize: 70,
  [theme.breakpoints.down('sm')]: {
    fontSize: 40,
  },
  textTransform: 'uppercase',
}));

export const StyledSubTitle = styled(Typography)({
  textTransform: 'uppercase',
  letterSpacing: '1.3px',
});
