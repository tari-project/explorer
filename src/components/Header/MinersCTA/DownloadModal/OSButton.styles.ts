import { styled } from '@mui/material/styles';
import { Button, Icon } from '@mui/material';

export const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #784CF2 0%, #232A7C 100%)',
  color: '#fff',
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px 36px',
  gap: theme.spacing(1),
  minWidth: '200px',
}));

export const OSIcon = styled(Icon)(() => ({
  width: '24px',
  height: '24px',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  marginRight: '8px',
  display: 'inline-block',
  verticalAlign: 'middle',
  '&.Windows': {
    backgroundImage: `url(${require('@assets/images/ico-windows.svg')})`,
  },
  '&.Mac': {
    backgroundImage: `url(${require('@assets/images/ico-mac.svg')})`,
  },
  '&.Linux': {
    backgroundImage: `url(${require('@assets/images/ico-linux.svg')})`,
  },
}));
