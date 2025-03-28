import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import {
  Button,
  ButtonWrapper,
  Dot,
  NumberWrapper,
  Text,
  TextWrapper,
  Wrapper,
} from './MinersCTA.styles';
import ArrowIcon from '../images/ArrowIcon';
import { useMinerStats } from '../../../services/api/hooks/useMinerStats';
import { getOS } from '../../../utils/getOs';

const NumberFlow = lazy(() => import('@number-flow/react'));

interface Props {
  theme: 'light' | 'dark';
  buttonText: string;
  hoverAnimation?: boolean;
  hoverText?: string;
  noBackground?: boolean;
}

export default function MinersCTA({ theme, buttonText, noBackground }: Props) {
  const { data } = useMinerStats();
  const countValue = data?.totalMiners ?? 0;
  const [numberWidth, setNumberWidth] = useState(26);
  const numberRef = useRef<HTMLSpanElement>(null);
  const [downloadLink, setDownloadLink] = useState('https://airdrop.tari.com/');
  const os = getOS();

  useEffect(() => {
    if (numberRef.current) {
      const width = numberRef.current.offsetWidth;
      setNumberWidth(width > 0 ? width : 26);
    }
  }, [countValue]);

  useEffect(() => {
    switch (os) {
      case 'Windows':
        setDownloadLink('https://airdrop.tari.com/api/miner/download/windows');
        break;
      case 'MacOS':
        setDownloadLink('https://airdrop.tari.com/api/miner/download/macos');
        break;
      case 'Linux':
        setDownloadLink('https://airdrop.tari.com/api/miner/download/linux');
        break;
      default:
        setDownloadLink('https://airdrop.tari.com/');
    }
  }, [os]);

  const handleDownloadClick = () => {
    window.open(downloadLink, '_blank');
  };

  return (
    <Wrapper $theme={theme} $noBackground={noBackground}>
      <TextWrapper>
        <Dot $theme={theme} />
        <Text $theme={theme}>
          <NumberWrapper style={{ width: `${numberWidth}px` }}>
            <span ref={numberRef}>
              <Suspense fallback={<div>Loading...</div>}>
                <NumberFlow
                  value={countValue}
                  format={{
                    notation: countValue > 10000 ? 'compact' : 'standard',
                    compactDisplay: 'short',
                    maximumFractionDigits: 1,
                  }}
                />
              </Suspense>
            </span>
          </NumberWrapper>
          active miners
        </Text>
      </TextWrapper>
      <ButtonWrapper>
        <Button
          $theme={theme}
          href={downloadLink}
          onClick={handleDownloadClick}
          target="_blank"
        >
          <span>{buttonText}</span> <ArrowIcon className="arrow-icon" />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}
