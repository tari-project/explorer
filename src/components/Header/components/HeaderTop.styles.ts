import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const StyledContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}));

export const LogoBox = styled(Box)(() => ({
  marginTop: '10px',
  transition: 'margin 0.3s ease-in-out',
}));

export const LogoBoxMobile = styled(Box)(() => ({
  marginTop: '10px',
  marginLeft: '-25px',
  transition: 'margin 0.3s ease-in-out',
  scale: '0.8',
}));

export const MobileBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: theme.spacing(1),
  width: '100%',
}));

export const DesktopBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: theme.spacing(3),
}));
