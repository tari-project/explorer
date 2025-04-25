import { HeaderDark } from './Header.styles';
import HeaderBottom from './HeaderBottom/HeaderBottom';
import HeaderTop from './HeaderTop/HeaderTop';
import { darkTheme } from '@theme/themes';
import { ThemeProvider } from '@emotion/react';
import MobileHeader from './MobileHeader/MobileHeader';
import { useMainStore } from '@services/stores/useMainStore';

export default function Header() {
  const isMobile = useMainStore((state) => state.isMobile);
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
