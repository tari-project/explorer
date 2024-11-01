import Header from './Header';
import TopBar from './TopBar';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

const darkBg = 'rgb(25, 14, 43, 0.95)';
const lightBg = 'rgba(0,0,0,0.1)';

function AppHeader() {
  const [bgColor, setBgColor] = useState(lightBg);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setBgColor(darkBg);
        setIsScrolled(true);
      } else {
        setBgColor(lightBg);
        setIsScrolled(false);
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
        transition: 'background-color 0.3s ease',
        zIndex: 1000,
      }}
    >
      <TopBar />
      <Header isScrolled={isScrolled} />
    </Box>
  );
}

export default AppHeader;
