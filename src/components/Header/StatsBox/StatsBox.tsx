import numeral from 'numeral';
import { useAllBlocks } from '@services/api/hooks/useBlocks';
import { formatHash } from '@utils/helpers';
import StatsDesktop from './StatsDesktop/StatsDesktop';
import StatsMobile from './StatsMobile/StatsMobile';
import { useMainStore } from '@services/stores/useMainStore';

function StatsBox() {
  const { data } = useAllBlocks();
  const values = data?.blockTimes || [];
  const sum = values.reduce(
    (accumulator: number, currentValue: number) => accumulator + currentValue,
    0
  );
  const isMobile = useMainStore((state) => state.isMobile);

  const latestMoneroHashRate = data?.currentMoneroHashRate ?? 0;
  const latestShaHashRate = data?.currentShaHashRate ?? 0;

  const average = sum / values.length;
  const formattedAverageBlockTime = numeral(average).format('0') + 'm';
  const formattedBlockHeight = numeral(
    data?.tipInfo.metadata.best_block_height
  ).format('0,0');
  const formattedMoneroHashRate = formatHash(latestMoneroHashRate);
  const formattedSha3HashRate = formatHash(latestShaHashRate);

  return isMobile ? (
    <StatsMobile
      moneroHashRate={formattedMoneroHashRate}
      shaHashRate={formattedSha3HashRate}
      averageBlockTime={formattedAverageBlockTime}
      blockHeight={formattedBlockHeight}
    />
  ) : (
    <StatsDesktop
      moneroHashRate={formattedMoneroHashRate}
      shaHashRate={formattedSha3HashRate}
      averageBlockTime={formattedAverageBlockTime}
      blockHeight={formattedBlockHeight}
    />
  );
}

export default StatsBox;
