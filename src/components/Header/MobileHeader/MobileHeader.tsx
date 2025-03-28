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
import TariLogo from '../../../assets/TariLogo';
import MobileMenuButton from '../MobileMenuButton/MobileMenuButton';
import { useMainStore } from '../../../services/stores/useMainStore';
import MinersCTA from '../MinersCTA/MinersCTA';
import { SocialIconButtons } from '../../SocialLinks/SocialLinks';
import MobileNavigation from './MobileNavigation/MobileNavigation';
import SearchField from '../SearchField/SearchField';

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
            {!isExpanded && <TariLogo fill="#FFF" />}
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
