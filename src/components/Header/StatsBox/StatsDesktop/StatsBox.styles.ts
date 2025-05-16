import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    flexWrap: 'wrap',
    '& > *': {
      width: '45%',
    },
  },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    gap: theme.spacing(4),
    '& > *': {
      borderRight: `1px solid ${theme.palette.divider}`,
      paddingRight: theme.spacing(2),
    },
    '& > *:last-child': {
      borderRight: 'none',
    },
  },
}));
