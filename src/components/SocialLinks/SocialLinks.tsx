import { useMainStore } from '../../services/stores/useMainStore';
import DiscordIcon from './icons/DiscordIcon';
import GithubIcon from './icons/GithubIcon';
import InstagramIcon from './icons/InstagramIcon';
import TelegramIcon from './icons/TelegramIcon';
import TikTokIcon from './icons/TikTokIcon';
import XIcon from './icons/XIcon';
import YoutubeIcon from './icons/YoutubeIcon';
import { Wrapper, SocialIcon } from './styles';

export const SocialIconButtons = () => {
  const { setShowMobileMenu } = useMainStore();

  const handleLinkClick = () => {
    setShowMobileMenu(false);
  };

  return (
    <>
      <SocialIcon
        href="https://twitter.com/tari"
        target="_blank"
        rel="noreferrer"
        onClick={handleLinkClick}
      >
        <XIcon />
      </SocialIcon>
      <SocialIcon
        href="https://t.me/tariproject"
        target="_blank"
        rel="noreferrer"
        onClick={handleLinkClick}
      >
        <TelegramIcon />
      </SocialIcon>
      <SocialIcon
        href="https://discord.gg/tari"
        target="_blank"
        rel="noreferrer"
        onClick={handleLinkClick}
      >
        <DiscordIcon />
      </SocialIcon>
      <SocialIcon
        href="https://www.tiktok.com/@tari_xtr"
        target="_blank"
        rel="noreferrer"
        onClick={handleLinkClick}
      >
        <TikTokIcon />
      </SocialIcon>
      <SocialIcon
        href="https://github.com/tari-project"
        target="_blank"
        rel="noreferrer"
        onClick={handleLinkClick}
      >
        <GithubIcon />
      </SocialIcon>
      <SocialIcon
        href="https://www.youtube.com/channel/UCFjcsEiAtr9mC1Yt0uJ-3xA"
        target="_blank"
        rel="noreferrer"
        onClick={handleLinkClick}
      >
        <YoutubeIcon />
      </SocialIcon>
      <SocialIcon
        href="https://www.instagram.com/tari_xtr"
        target="_blank"
        rel="noreferrer"
        onClick={handleLinkClick}
      >
        <InstagramIcon />
      </SocialIcon>
    </>
  );
};

export default function SocialLinks() {
  return (
    <Wrapper>
      <SocialIconButtons />
    </Wrapper>
  );
}
