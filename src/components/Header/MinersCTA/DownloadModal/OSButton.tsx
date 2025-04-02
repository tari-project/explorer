import WindowsIcon from '@assets/images/ico-windows.svg';
import MacIcon from '@assets/images/ico-mac.svg';
import LinuxIcon from '@assets/images/ico-linux.svg';
import { GradientButton } from './OSButton.styles';
import { Icon } from '@mui/material';
import { DOWNLOAD_LINKS } from '@utils/downloadLinks';

interface OSButtonProps {
  os: 'Windows' | 'Mac' | 'Linux';
}

const OS_CONFIG = {
  Windows: {
    icon: WindowsIcon,
    label: 'Windows',
    link: DOWNLOAD_LINKS.windows,
  },
  Mac: {
    icon: MacIcon,
    label: 'Mac',
    link: DOWNLOAD_LINKS.mac,
  },
  Linux: {
    icon: LinuxIcon,
    label: 'Linux',
    link: DOWNLOAD_LINKS.linux,
  },
};

function OSButton({ os }: OSButtonProps) {
  const handleClick = () => {
    const downloadLink = OS_CONFIG[os]?.link;
    if (downloadLink) {
      window.open(downloadLink, '_blank');
    }
  };

  const { icon, label } = OS_CONFIG[os] || {};

  if (!icon || !label) return null;

  return (
    <GradientButton onClick={handleClick}>
      <Icon
        sx={{
          width: '24px',
          height: '24px',
          backgroundImage: `url(${icon})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
      ></Icon>
      {label}
    </GradientButton>
  );
}

export default OSButton;
