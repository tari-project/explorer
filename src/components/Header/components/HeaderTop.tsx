import { useState } from 'react';
import numeral from 'numeral';
import TariLogo from '../../../assets/TariLogo';
import { useTheme } from '@mui/material/styles';
import StatsItem from './StatsItem';
import { Divider, Fade, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { useAllBlocks } from '../../../api/hooks/useBlocks';
import StatsDialog from './StatsDialog';
import SearchField from './SearchField';
import { formatHash } from '../../../utils/helpers';
import {
  StyledContainer,
  LogoBox,
  MobileBox,
  DesktopBox,
} from './HeaderTop.styles';
import MinersCTA from './MinersCTA';

function HeaderTop() {
  const { data } = useAllBlocks();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const showMinersCTA = useMediaQuery(theme.breakpoints.up('xl'));
  const [isExpanded, setIsExpanded] = useState(false);
  const values = data?.blockTimes || [];
  const sum = values.reduce(
    (accumulator: number, currentValue: number) => accumulator + currentValue,
    0
  );

  const latestMoneroHashRate = data?.currentMoneroHashRate ?? 0;
  const latestShaHashRate = data?.currentShaHashRate ?? 0;

  const average = sum / values.length;
  const formattedAverageBlockTime = numeral(average).format('0') + 'm';
  const formattedBlockHeight = numeral(
    data?.tipInfo.metadata.best_block_height
  ).format('0,0');
  const formattedMoneroHashRate = formatHash(latestMoneroHashRate);
  const formattedSha3HashRate = formatHash(latestShaHashRate);

  return (
    <>
      {isMobile ? (
        <StyledContainer>
          {!isExpanded && (
            <Fade in={!isExpanded}>
              <Link to="/">
                <LogoBox>
                  <TariLogo fill={theme.palette.text.primary} />
                </LogoBox>
              </Link>
            </Fade>
          )}
          <MobileBox>
            <Box
              style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <SearchField
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
              />
            </Box>
            <StatsDialog />
          </MobileBox>
        </StyledContainer>
      ) : (
        <>
          <StyledContainer>
            <Link to="/">
              <LogoBox>
                <TariLogo fill={theme.palette.text.primary} />
              </LogoBox>
            </Link>
            <DesktopBox>
              <StatsItem
                label="RandomX Hash Rate"
                value={formattedMoneroHashRate}
              />
              <Divider
                orientation="vertical"
                flexItem
                color={theme.palette.divider}
              />
              <StatsItem label="Sha3 Hash Rate" value={formattedSha3HashRate} />
              <Divider
                orientation="vertical"
                flexItem
                color={theme.palette.divider}
              />
              <StatsItem
                label="Avg Block Time"
                value={formattedAverageBlockTime}
                lowerCase
              />
              <Divider
                orientation="vertical"
                flexItem
                color={theme.palette.divider}
              />
              <StatsItem label="Block Height" value={formattedBlockHeight} />
            </DesktopBox>
            {showMinersCTA && (
              <MinersCTA
                theme="dark"
                buttonText="Start Earning"
                noBackground={false}
              />
            )}
          </StyledContainer>
          <Divider />
        </>
      )}
    </>
  );
}

export default HeaderTop;
