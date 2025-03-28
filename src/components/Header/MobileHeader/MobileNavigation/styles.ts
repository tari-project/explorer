import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

export const Wrapper = styled(motion.div)<{}>(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '20px 0',
  overflow: 'hidden',
  transition: 'height 0.3s ease',
}));

export const NavLink = styled('button')(() => ({
  color: '#fff',
  fontFamily: 'var(--font-poppins), sans-serif',
  fontSize: '18px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '94.2%',
  letterSpacing: '-0.9px',
  padding: '15px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const GroupOne = styled(motion.div)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  width: '100%',
}));

export const GroupTwo = styled(motion.div)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  width: '100%',
}));
