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
import { useMinerStats } from '@services/api/hooks/useMinerStats';
import { getOS } from '@utils/getOs';
import { DOWNLOAD_LINKS } from '@utils/downloadLinks';
import DownloadModal from './DownloadModal/DownloadModal';
import { useMainStore } from '@services/stores/useMainStore';

const NumberFlow = lazy(() => import('@number-flow/react'));

interface Props {
  theme: 'light' | 'dark';
  buttonText?: string;
  hoverAnimation?: boolean;
  hoverText?: string;
  noBackground?: boolean;
  minersOnly?: boolean;
  buttonOnly?: boolean;
}

export default function MinersCTA({
  theme,
  buttonText = 'Download Tari Universe',
  noBackground,
  minersOnly = false,
  buttonOnly = false,
}: Props) {
  const { data } = useMinerStats();
  const countValue = data?.totalMiners ?? 0;
  const [numberWidth, setNumberWidth] = useState(26);
  const numberRef = useRef<HTMLSpanElement>(null);
  const [downloadLink, setDownloadLink] = useState(DOWNLOAD_LINKS.default);
  const os = getOS();
  const isMobile = useMainStore((state) => state.isMobile);
  const setShowDownloadModal = useMainStore(
    (state) => state.setShowDownloadModal
  );

  useEffect(() => {
    if (numberRef.current) {
      const width = numberRef.current.offsetWidth;
      setNumberWidth(width > 0 ? width : 26);
    }
  }, [countValue]);

  useEffect(() => {
    switch (os) {
      case 'Windows':
        setDownloadLink(DOWNLOAD_LINKS.windows);
        break;
      case 'MacOS':
        setDownloadLink(DOWNLOAD_LINKS.mac);
        break;
      case 'Linux':
        setDownloadLink(DOWNLOAD_LINKS.linux);
        break;
      default:
        setDownloadLink(DOWNLOAD_LINKS.default);
    }
  }, [os]);

  const handleDownloadClick = () => {
    window.open(downloadLink, '_blank');
    if (os === 'Windows' || os === 'MacOS' || os === 'Linux') {
      setShowDownloadModal(true);
      setTimeout(() => {
        setShowDownloadModal(false);
      }, 20000);
    }
  };

  if (minersOnly) {
    return (
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
    );
  }

  if (buttonOnly) {
    return (
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
    );
  }

  return (
    <>
      {!isMobile && <DownloadModal />}
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
    </>
  );
}
