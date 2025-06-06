import { StatsWrapperSml, StatsRowSml } from './StatsMobile.styles';
import StatsItem from './StatsItem/StatsItem';

interface StatsBoxProps {
  moneroHashRate: string;
  shaHashRate: string;
  tariRandomXHashRate: string;
  averageBlockTime: string;
  blockHeight: string;
}

function StatsMobile({
  moneroHashRate,
  shaHashRate,
  tariRandomXHashRate,
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
              Sha3X
              <br />
              Hash Rate
            </>
          }
          value={shaHashRate}
        />
        <StatsItem
          label={
            <>
              Tari RandomX
              <br />
              Hash Rate
            </>
          }
          value={tariRandomXHashRate}
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
