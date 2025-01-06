import Header from './Header';
import TopBar from './TopBar';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

const darkBg = 'rgb(20, 16, 35, 0.95)';
const lightBg = 'rgba(0,0,0,0.1)';

function AppHeader() {
  const [bgColor, setBgColor] = useState(lightBg);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setBgColor(darkBg);
      } else {
        setBgColor(lightBg);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        backgroundColor: bgColor,
        zIndex: 1000,
      }}
    >
      <TopBar />
      <Header />
    </Box>
  );
}

export default AppHeader;
