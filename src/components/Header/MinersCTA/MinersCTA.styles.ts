import { styled, keyframes } from '@mui/system';
import { Link } from '@mui/material';
import type { ThemeMode } from '@types';

const radarPulse = keyframes`
    0% {
        transform: scale(1);
        opacity: 0.6;
    }
    100% {
        transform: scale(2.5);
        opacity: 0;
    }
`;

export const Wrapper = styled('div')<{
  theme: ThemeMode;
  $noBackground?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 17px;

  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);

  height: 54px;
  padding: 10px 6px 10px 18px;

  position: relative;
  flex-shrink: 0;
  width: fit-content;

  ${({ theme }) =>
    theme === 'light' &&
    `
            border: 1px solid rgba(17, 17, 17, 0.2);
            background: rgba(17, 17, 17, 0.05);
        `}

  ${({ $noBackground }) =>
    $noBackground &&
    `
            background: none;
            border: none;
            padding: 0;
        `}

    @media (max-width: 450px) {
    gap: 12px;
    padding: 10px 8px 10px 16px;
    flex-wrap: wrap;
    justify-content: center;
    height: auto;
  }
`;

export const TextWrapper = styled('div')`
  display: flex;
  align-items: center;
  gap: 11px;
  position: relative;
`;

export const Dot = styled('div')<{ theme: ThemeMode }>`
  width: 11px;
  height: 11px;
  background: linear-gradient(180deg, #0f9 0%, #b0d636 100%);
  border-radius: 50%;

  position: absolute;
  top: 50%;
  left: 0px;
  transform: translateY(-50%) translateY(1px);
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: 50%;
    z-index: -1;
    animation: ${radarPulse} 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

export const DotSml = styled('div')<{ theme: ThemeMode }>`
  width: 8px;
  height: 8px;
  background: linear-gradient(180deg, #0f9 0%, #b0d636 100%);
  border-radius: 50%;

  position: absolute;
  top: 50%;
  left: 0px;
  transform: translateY(-50%) translateY(1px);
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: 50%;
    z-index: -1;
    animation: ${radarPulse} 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

export const Text = styled('div')<{ theme: ThemeMode }>`
  color: #71ee73;
  font-family: var(--font-poppins), sans-serif;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;

  letter-spacing: -0.75px;
  line-height: 100%;
  transform: translateY(1px);
  white-space: nowrap;

  ${({ theme }) =>
    theme === 'light' &&
    `
            color: #26764e;
        `}

  @media (max-width: 450px) {
    font-size: 14px;
  }
`;

export const ButtonWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

export const Button = styled(Link)<{ theme: ThemeMode }>`
  position: relative;
  z-index: 1;
  border-radius: 10px;
  background: #fff;
  background-image: linear-gradient(90deg, #fff 0%, #fff 100%);

  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  height: 43px;
  padding: 0px 15px 0px 20px;

  color: #1b1b1b;
  font-family: var(--font-poppins), sans-serif;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: -0.75px;
  white-space: nowrap;

  transition: all 0.3s ease;
  user-select: none;
  text-decoration: none;

  .arrow-icon {
    transition: transform 0.3s ease;
    transform: rotate(90deg);
    transform-origin: center center;
    flex-shrink: 0;
  }

  &:hover {
    text-decoration: none;
    background-image: linear-gradient(90deg, #c9eb00 0%, #fff 100%);

    .arrow-icon {
      transform: rotate(0deg);
      transform-origin: center center;
    }
  }

  ${({ theme }) =>
    theme === 'light' &&
    `
            background: #000;
            color: #fff;

            &:hover {
                background: #000;
            }
        `}
`;

export const NumberWrapper = styled('span')`
  display: inline-block;
  text-align: right;
  margin-right: 4px;
  margin-left: 24px;
  text-transform: lowercase;

  transition: width 0.3s ease;
  min-width: 34px;
`;

export const NumberWrapperSml = styled('span')`
  display: inline-block;
  text-align: right;
  margin-right: 4px;
  margin-left: 14px;
  text-transform: lowercase;

  transition: width 0.3s ease;
  min-width: 10px;
`;
