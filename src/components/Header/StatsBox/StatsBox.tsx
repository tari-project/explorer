import numeral from 'numeral';
import { useAllBlocks } from '@services/api/hooks/useBlocks';
import { formatHash } from '@utils/helpers';
import StatsDesktop from './StatsDesktop/StatsDesktop';
import StatsMobile from './StatsMobile/StatsMobile';

interface StatsBoxProps {
  variant: 'desktop' | 'mobile';
}

function StatsBox({ variant }: StatsBoxProps) {
  const { data } = useAllBlocks();
  const values = data?.blockTimes || [];
  const targetTime = 2;
  const sum = values.reduce(
    (accumulator: number, currentValue: number) => accumulator + currentValue,
    0
  );
  const sanitizeValue = (val: string):number => Number(val?.replace(/,/g, ''));
  const latestMoneroHashRate = sanitizeValue(data?.currentMoneroRandomxHashRate) ?? 0;
  const latestShaHashRate = sanitizeValue(data?.currentSha3xHashRate) ?? 0;
  const latestTRXHashRate = sanitizeValue(data?.currentTariRandomxHashRate) ?? 0;


  const average = sum / values.length;
  const formattedAverageBlockTime =
    numeral(average + targetTime).format('0') + 'm';
  const formattedBlockHeight = numeral(
    data?.tipInfo.metadata.best_block_height
  ).format('0,0');
  const formattedMoneroHashRate = formatHash(latestMoneroHashRate);
  const formattedSha3HashRate = formatHash(latestShaHashRate);
  const formattedTRXHashRate = formatHash(latestTRXHashRate);

  return variant === 'mobile' ? (
    <StatsMobile
      moneroHashRate={formattedMoneroHashRate}
      shaHashRate={formattedSha3HashRate}
      tariRandomXHashRate={formattedTRXHashRate}
      averageBlockTime={formattedAverageBlockTime}
      blockHeight={formattedBlockHeight}
    />
  ) : (
    <StatsDesktop
      moneroHashRate={formattedMoneroHashRate}
      tariRandomXHashRate={formattedTRXHashRate}
      shaHashRate={formattedSha3HashRate}
      averageBlockTime={formattedAverageBlockTime}
      blockHeight={formattedBlockHeight}
    />
  );
}

export default StatsBox;
