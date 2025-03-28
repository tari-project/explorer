import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

export const Wrapper = styled('button')({
  display: 'flex',
  width: '50px',
  height: '50px',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'translateX(10px)',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',
});

export const IconContainer = styled('div')({
  width: '25px',
  height: '14px',
  position: 'relative',
});

export const Line = styled(motion.div)({
  height: '3px',
  backgroundColor: '#fff',
  borderRadius: '1px',
  position: 'absolute',
});
