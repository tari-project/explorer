import { HeaderDark } from './Header.styles';
import HeaderBottom from './components/HeaderBottom';
import HeaderTop from './components/HeaderTop';
import { darkTheme } from '../../theme/themes';
import { ThemeProvider } from '@emotion/react';

export default function Header() {
  return (
    <ThemeProvider theme={darkTheme}>
      <HeaderDark>
        <HeaderTop />
        <HeaderBottom />
      </HeaderDark>
    </ThemeProvider>
  );
}
