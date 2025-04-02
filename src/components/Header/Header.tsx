import { HeaderDark } from './Header.styles';
import HeaderBottom from './HeaderBottom/HeaderBottom';
import HeaderTop from './HeaderTop/HeaderTop';
import { darkTheme } from '@theme/themes';
import { ThemeProvider } from '@emotion/react';
import { useMediaQuery, useTheme } from '@mui/material';
import MobileHeader from './MobileHeader/MobileHeader';

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <ThemeProvider theme={darkTheme}>
      {isMobile ? (
        <MobileHeader />
      ) : (
        <HeaderDark>
          <HeaderTop />
          <HeaderBottom />
        </HeaderDark>
      )}
    </ThemeProvider>
  );
}
