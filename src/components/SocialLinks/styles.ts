import { Link } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '14px',
  paddingTop: '26px',
  borderTop: '1px solid rgba(223, 229, 242, 0.3)',

  [theme.breakpoints.down('lg')]: {
    justifyContent: 'center',
  },

  [theme.breakpoints.down('md')]: {
    justifyContent: 'flex-start',
  },
}));

export const SocialIcon = styled(Link)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.75,
  transition: 'opacity 0.2s ease, transform 0.2s ease',

  '& svg': {
    height: '20px',
  },

  '&:hover': {
    opacity: 1,
    transform: 'scale(1.1)',
  },
}));
