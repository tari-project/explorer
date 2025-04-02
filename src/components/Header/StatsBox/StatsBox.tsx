import { Wrapper } from './StatsBox.styles';
import numeral from 'numeral';
import StatsItem from './StatsItem/StatsItem';
import { useAllBlocks } from '@services/api/hooks/useBlocks';
import { formatHash } from '@utils/helpers';

function StatsBox() {
  const { data } = useAllBlocks();
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
    <Wrapper>
      <StatsItem label="RandomX Hash Rate" value={formattedMoneroHashRate} />
      <StatsItem label="Sha3 Hash Rate" value={formattedSha3HashRate} />
      <StatsItem
        label="Avg Block Time"
        value={formattedAverageBlockTime}
        lowerCase
      />
      <StatsItem label="Block Height" value={formattedBlockHeight} />
    </Wrapper>
  );
}

export default StatsBox;
