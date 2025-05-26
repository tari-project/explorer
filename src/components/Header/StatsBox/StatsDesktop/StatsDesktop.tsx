import { Wrapper } from './StatsBox.styles';
import StatsItem from './StatsItem/StatsItem';

interface StatsBoxProps {
  moneroHashRate: string;
  shaHashRate: string;
  tariRandomXHashRate: string;
  averageBlockTime: string;
  blockHeight: string;
}

function StatsDesktop({
  moneroHashRate,
  shaHashRate,
  tariRandomXHashRate,
  averageBlockTime,
  blockHeight,
}: StatsBoxProps) {
  return (
    <Wrapper>
      <StatsItem label="RandomX Hash Rate" value={moneroHashRate} />
      <StatsItem label="Sha3X Hash Rate" value={shaHashRate} />
      <StatsItem label="Tari RandomX Hash Rate" value={tariRandomXHashRate} />
      <StatsItem label="Avg Block Time" value={averageBlockTime} lowerCase />
      <StatsItem label="Block Height" value={blockHeight} />
    </Wrapper>
  );
}

export default StatsDesktop;
