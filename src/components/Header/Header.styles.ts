import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import headerBgImage from '../Header/images/header-bg.png';

export const Wrapper = styled.div`
  width: 100%;
  padding: 20px 0;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 99;
`;

const BaseHeader = styled(motion.div)`
  padding: 14px 20px 10px 30px;
  pointer-events: auto;
  display: flex;
  width: 100%;
  border-radius: 15px;
  box-shadow: 10px 10px 75px 0px rgba(0, 0, 0, 0.35);
`;

export const HeaderDark = styled(BaseHeader)`
  background-image: url(${headerBgImage});
  background-position: center;
  background-repeat: repeat;
  background-size: contain;
  background-color: #0c0718;
  margin-top: 40px;
  z-index: 9;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  position: sticky;
  top: 10px;
`;

export const DesktopOnly = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 886px) {
    display: none;
  }
`;
