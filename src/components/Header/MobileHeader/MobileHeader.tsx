import { useEffect, useState } from 'react';
import {
  HeaderTop,
  Inside,
  Menu,
  MenuHolder,
  SocialLinks,
  Wrapper,
  IconsContainer,
} from './styles';
import MobileMenuButton from '../MobileMenuButton/MobileMenuButton';
import { useMainStore } from '../../../services/stores/useMainStore';
import MinersCTA from '../MinersCTA/MinersCTA';
import { SocialIconButtons } from '../../SocialLinks/SocialLinks';
import MobileNavigation from './MobileNavigation/MobileNavigation';
import SearchField from '../SearchField/SearchField';
import Logo from '../../../assets/images/tari-logo.svg';
import { Link } from 'react-router-dom';

export default function MobileHeader() {
  const { showMobileMenu, setShowMobileMenu } = useMainStore();
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
            {!isExpanded && (
              <Link to="/">
                <img
                  src={Logo}
                  alt="Tari Logo"
                  style={{
                    scale: '0.85',
                    transformOrigin: 'left',
                    paddingTop: '5px',
                  }}
                />
              </Link>
            )}
            <IconsContainer>
              <SearchField
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
              />
              <MobileMenuButton />
            </IconsContainer>
          </HeaderTop>
        </Inside>
      </Wrapper>
      {showMobileMenu && (
        <Menu>
          <MenuHolder>
            <MobileNavigation />
            <MinersCTA theme="dark" buttonText={`Download`} />
            <SocialLinks>
              <SocialIconButtons />
            </SocialLinks>
          </MenuHolder>
        </Menu>
      )}
    </>
  );
}
