import { DesktopBox } from './StatsBox.styles';
import numeral from 'numeral';
import { useTheme } from '@mui/material/styles';
import StatsItem from './StatsItem';
import { Divider } from '@mui/material';
import { useAllBlocks } from '../../../api/hooks/useBlocks';
import { formatHash } from '../../../utils/helpers';

function StatsBox() {
  const { data } = useAllBlocks();
  const theme = useTheme();
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
    <DesktopBox>
      <StatsItem label="RandomX Hash Rate" value={formattedMoneroHashRate} />
      <Divider orientation="vertical" flexItem color={theme.palette.divider} />
      <StatsItem label="Sha3 Hash Rate" value={formattedSha3HashRate} />
      <Divider orientation="vertical" flexItem color={theme.palette.divider} />
      <StatsItem
        label="Avg Block Time"
        value={formattedAverageBlockTime}
        lowerCase
      />
      <Divider orientation="vertical" flexItem color={theme.palette.divider} />
      <StatsItem label="Block Height" value={formattedBlockHeight} />
    </DesktopBox>
  );
}

export default StatsBox;
