import { IconContainer, Line, Wrapper } from './styles';
import { useMainStore } from '../../../services/stores/useMainStore';

const topLineVariants = {
  closed: {
    width: '24px',
    top: '0px',
    right: '0px',
    rotate: 0,
    transformOrigin: 'center center',
  },
  open: {
    width: '22px',
    top: '5px',
    right: '0px',
    rotate: 45,
    transformOrigin: 'center center',
  },
};

const bottomLineVariants = {
  closed: {
    width: '14px',
    top: '10px',
    right: '0px',
    rotate: 0,
    transformOrigin: 'center center',
  },
  open: {
    width: '22px',
    top: '5px',
    right: '0px',
    rotate: -45,
    transformOrigin: 'center center',
  },
};

export default function MobileMenuButton() {
  const showMobileMenu = useMainStore((state) => state.showMobileMenu);
  const setShowMobileMenu = useMainStore((state) => state.setShowMobileMenu);

  return (
    <Wrapper onClick={() => setShowMobileMenu(!showMobileMenu)}>
      <IconContainer>
        <Line
          variants={topLineVariants}
          initial="closed"
          animate={showMobileMenu ? 'open' : 'closed'}
          transition={{ duration: 0.5, ease: 'anticipate' }}
        />
        <Line
          variants={bottomLineVariants}
          initial="closed"
          animate={showMobileMenu ? 'open' : 'closed'}
          transition={{ duration: 0.5, ease: 'anticipate' }}
        />
      </IconContainer>
    </Wrapper>
  );
}
