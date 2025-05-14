import { StatsWrapperSml, StatsRowSml } from './StatsMobile.styles';
import StatsItem from './StatsItem/StatsItem';

interface StatsBoxProps {
  moneroHashRate: string;
  shaHashRate: string;
  averageBlockTime: string;
  blockHeight: string;
}

function StatsMobile({
  moneroHashRate,
  shaHashRate,
  averageBlockTime,
  blockHeight,
}: StatsBoxProps) {
  return (
    <StatsWrapperSml>
      <StatsRowSml>
        <StatsItem label="RandomX Hash" value={moneroHashRate} />
        <StatsItem label="Sha3 Hash" value={shaHashRate} />
      </StatsRowSml>
      <StatsRowSml>
        <StatsItem label="Avg Block Time" value={averageBlockTime} lowerCase />
        <StatsItem label="Block Height" value={blockHeight} />
      </StatsRowSml>
    </StatsWrapperSml>
  );
}

export default StatsMobile;
