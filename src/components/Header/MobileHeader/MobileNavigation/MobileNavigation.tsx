'use client';
import { Wrapper, NavLink } from './styles';
import { useMainStore } from '@services/stores/useMainStore';

export default function MobileNavigation() {
  const setShowMobileMenu = useMainStore((state) => state.setShowMobileMenu);

  const handleNavLinkClick = () => {
    setShowMobileMenu(false);
  };

  return (
    <Wrapper>
      <NavLink to="/" onClick={handleNavLinkClick}>
        Home
      </NavLink>
      <NavLink to="/blocks" onClick={handleNavLinkClick}>
        Blocks
      </NavLink>
      <NavLink to="/mempool" onClick={handleNavLinkClick}>
        Mempool
      </NavLink>
    </Wrapper>
  );
}
