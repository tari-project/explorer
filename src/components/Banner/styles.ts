import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import backgroundImage from './images/background.png';

export const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: '57px',
  backgroundColor: '#1e1e25',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  zIndex: 99,
  [theme.breakpoints.down(886)]: {
    height: '40px',
  },
  [theme.breakpoints.down(492)]: {
    height: 'auto',
    flexDirection: 'column',
    padding: '10px 20px',
  },
}));

export const Holder = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '1604px',
  margin: '0 auto',
  width: '100%',
  gap: '13px',
});

export const Text = styled('p')(({ theme }) => ({
  color: '#fff',
  textAlign: 'center',
  fontFamily: 'var(--font-poppins), sans-serif',
  fontSize: '17px',
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: '94.2%',
  textTransform: 'uppercase',
  [theme.breakpoints.down(886)]: {
    fontSize: '12px',
  },
}));

export const GradientText = styled('span')({
  background: 'linear-gradient(90deg, #35ffbf 0%, #baba43 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
});

export const Button = styled(Link)(({ theme }) => ({
  borderRadius: '30px',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0px 20px',
  height: '32px',
  color: '#fff',
  fontFamily: 'var(--font-poppins), sans-serif',
  fontSize: '13px',
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: '94.2%',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    textDecoration: 'none',
    border: '1px solid rgba(255, 255, 255, 0.6)',
  },
  [theme.breakpoints.down(886)]: {
    fontSize: '11px',
    height: '26px',
    padding: '0px 15px',
  },
}));
