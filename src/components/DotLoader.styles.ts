import { styled, keyframes } from '@mui/material/styles';

const bounce = keyframes`
  to {
    opacity: 0.3;
    transform: scale(1.2);
  }
`;
export const DotLoaderContainer = styled('div')({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '40px',
  minHeight: '28px',
});
export const Dot = styled('span')<{ delay?: string }>(({ delay }) => ({
  display: 'block',
  width: '6px',
  height: '6px',
  background: '#333',
  borderRadius: '50%',
  opacity: 0.2,
  transform: 'scale(1)',
  animation: `${bounce} 0.7s infinite alternate`,
  animationDelay: delay || '0s',
}));
