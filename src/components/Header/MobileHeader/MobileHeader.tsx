import { useEffect, useState } from 'react';
import {
  HeaderTop,
  Inside,
  Menu,
  MenuHolder,
  SocialLinks,
  Wrapper,
  IconsContainer,
  Inner,
} from './styles';
import MobileMenuButton from '../MobileMenuButton/MobileMenuButton';
import { useMainStore } from '@services/stores/useMainStore';
import MinersCTA from '../MinersCTA/MinersCTA';
import { SocialIconButtons } from '@components/SocialLinks/SocialLinks';
import MobileNavigation from './MobileNavigation/MobileNavigation';
import SearchField from '../SearchField/SearchField';
import Gem from '@assets/images/tari-gem.svg';
import { Link } from 'react-router-dom';

export default function MobileHeader() {
  const showMobileMenu = useMainStore((state) => state.showMobileMenu);
  const setShowMobileMenu = useMainStore((state) => state.setShowMobileMenu);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showMobileMenu]);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [setShowMobileMenu]);

  return (
    <>
      <Wrapper $open={showMobileMenu}>
        <Inside>
          <HeaderTop $open={showMobileMenu}>
            <Inner>
              {!isExpanded && (
                <>
                  <Link to="/">
                    <img
                      src={Gem}
                      alt="Tari Logo"
                      style={{
                        scale: '0.85',
                        transformOrigin: 'left',
                        paddingTop: '5px',
                      }}
                    />
                  </Link>
                  <MinersCTA
                    theme="dark"
                    buttonText={`Download Tari Universe`}
                    noBackground
                    hoverAnimation={false}
                    minersOnly
                  />
                </>
              )}
              <IconsContainer $isExpanded={isExpanded}>
                <SearchField
                  isExpanded={isExpanded}
                  setIsExpanded={setIsExpanded}
                />
                <MobileMenuButton />
              </IconsContainer>
            </Inner>
          </HeaderTop>
        </Inside>
      </Wrapper>
      {showMobileMenu && (
        <Menu>
          <MenuHolder>
            <MobileNavigation />
            <MinersCTA
              theme="dark"
              buttonText={`Download Tari Universe`}
              buttonOnly
            />
            <SocialLinks>
              <SocialIconButtons />
            </SocialLinks>
          </MenuHolder>
        </Menu>
      )}
    </>
  );
}
