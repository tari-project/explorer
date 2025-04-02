import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const Modal = styled(Box)(() => ({
  width: '100%',
  maxWidth: '800px',
  minHeight: '600px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#E4E3EC',
  borderRadius: '16px',
  position: 'relative',
  flexDirection: 'column',
  marginTop: '100px',
}));

export const Wrapper = styled(Box)(() => ({
  position: 'absolute',
  top: '-150px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
}));

export const ImageWrapper = styled(Box)(() => ({
  zIndex: 1,
}));
