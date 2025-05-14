import { Wrapper } from '../StatsBox.styles';
import StatsItem from '../StatsItem/StatsItem';

interface StatsBoxProps {
  moneroHashRate: string;
  shaHashRate: string;
  averageBlockTime: string;
  blockHeight: string;
}

function StatsDesktop({
  moneroHashRate,
  shaHashRate,
  averageBlockTime,
  blockHeight,
}: StatsBoxProps) {
  return (
    <Wrapper>
      <StatsItem label="RandomX Hash Rate" value={moneroHashRate} />
      <StatsItem label="Sha3 Hash Rate" value={shaHashRate} />
      <StatsItem label="Avg Block Time" value={averageBlockTime} lowerCase />
      <StatsItem label="Block Height" value={blockHeight} />
    </Wrapper>
  );
}

export default StatsDesktop;
