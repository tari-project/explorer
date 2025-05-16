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
        <StatsItem
          label={
            <>
              RandomX
              <br />
              Hash Rate
            </>
          }
          value={moneroHashRate}
        />
        <StatsItem
          label={
            <>
              Sha3
              <br />
              Hash Rate
            </>
          }
          value={shaHashRate}
        />
        <StatsItem
          label={
            <>
              Avg Block
              <br />
              Time
            </>
          }
          value={averageBlockTime}
          lowerCase
        />
        <StatsItem
          label={
            <>
              Tip
              <br />
              Height
            </>
          }
          value={blockHeight}
        />
      </StatsRowSml>
    </StatsWrapperSml>
  );
}

export default StatsMobile;
