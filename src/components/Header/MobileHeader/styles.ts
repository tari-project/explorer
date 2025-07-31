import { motion } from 'framer-motion';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import headerBgImage from '../images/header-bg.png';

export const Wrapper = styled(motion.div, {
  shouldForwardProp: (prop: string) => prop !== '$open',
})<{ $open: boolean }>(
  ({ theme, $open }: { theme: Theme; $open: boolean }) => ({
    width: '100%',
    pointerEvents: 'none',
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 99,
    display: 'none',
    marginTop: '30px',
    [theme.breakpoints.down('lg')]: {
      display: 'flex',
    },
    ...($open && {
      width: '100%',
      height: '100dvh',
    }),
  })
);

export const Inside = styled('div')({
  position: 'relative',
  width: '100%',
});

export const HeaderTop = styled(motion.div, {
  shouldForwardProp: (prop: string) => prop !== '$open',
})<{ $open: boolean }>(({ $open }: { $open: boolean }) => ({
  padding: '14px',
  pointerEvents: 'auto',
  display: 'flex',
  gap: '8px',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  color: '#fff',
  position: 'relative',
  zIndex: 9,
  borderRadius: '15px',
  boxShadow: '10px 10px 75px 0px rgba(0, 0, 0, 0.35)',
  background: '#0c0718',
  backgroundImage: `url(${headerBgImage})`,
  backgroundRepeat: 'repeat',
  backgroundColor: '#0c0718',
  '.tari-logo': {
    width: '80px',
  },
  ...($open && {
    boxShadow: 'none',
  }),
}));

export const Inner = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

export const Menu = styled(motion.div)({
  boxShadow: '10px 10px 75px 0px rgba(0, 0, 0, 0.35)',
  background: '#0c0718',
  backgroundImage: `url(${headerBgImage})`,
  backgroundRepeat: 'repeat',
  backgroundColor: '#0c0718',
  width: '100%',
  height: '100dvh',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 98,
  padding: '30px',
  paddingTop: '160px',
});

export const MenuHolder = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '25px',
  maxWidth: '450px',
  margin: '0 auto',
});

export const SocialLinks = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '15px',
  paddingTop: '30px',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  width: '100%',
});

export const IconsContainer = styled('div')<{ $isExpanded: boolean }>(
  ({ $isExpanded }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...($isExpanded && {
      width: '100%',
    }),
  })
);

export const LogoContainer = styled('div')({
  scale: 0.8,
  transformOrigin: 'center',
});
