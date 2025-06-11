import { Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TransactionsWidgetProps {
  type: 'day' | 'all';
}

export const NumberTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'DrukHeavy, sans-serif',
  fontSize: '34px',
  color: theme.palette.text.primary,
}));

export const Line = styled('div')<TransactionsWidgetProps>(({ type }) => ({
  width: '3px',
  height: '40px',
  background:
    type === 'day'
      ? 'linear-gradient(80deg, #DA60FB -10.22%, #7967FF 113.87%)'
      : 'linear-gradient(80deg, #FF9958 -10.22%, #E56798 113.87%)',
  borderRadius: '2px',
}));

export const IconWrapper = styled('span')<{ bgcolor: string }>(
  ({ bgcolor }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: bgcolor,
    color: '#FFFFFF',
    padding: '6px',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
  })
);

export const LightTooltip = styled(Tooltip)(({ theme }) => ({
  tooltip: {
    backgroundColor: '#FFF',
    color: '#000',
    boxShadow: theme.shadows[1],
    fontSize: '0.875rem',
  },
}));

export const TooltipContainer = styled('div')({
  position: 'relative',
  display: 'inline-block',
  width: '100%',
});

export const CustomTooltip = styled('div')({
  visibility: 'hidden',
  backgroundColor: '#fff',
  color: '#000',
  textAlign: 'center',
  borderRadius: '4px',
  padding: '6px 12px',
  position: 'absolute',
  zIndex: 10,
  bottom: '60%',
  left: '50%',
  transform: 'translateX(-50%)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  fontSize: '0.95rem',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  opacity: 0,
  transition: 'opacity 0.5s',
});

export const TooltipWrapper = styled('div')({
  position: 'relative',
  width: '100%',
  '&:hover .custom-tooltip': {
    visibility: 'visible',
    opacity: 1,
  },
});
