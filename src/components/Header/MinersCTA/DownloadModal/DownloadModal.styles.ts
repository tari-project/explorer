import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material';

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

export const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: 8,
  color: theme.palette.grey[500],
}));

export const Header = styled(Typography)(() => ({
  textTransform: 'uppercase',
  fontSize: '100px',
  textAlign: 'center',
  lineHeight: '90px',
  maxWidth: '550px',
}));
