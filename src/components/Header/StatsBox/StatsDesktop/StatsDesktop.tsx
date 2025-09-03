import { Wrapper } from "./StatsBox.styles";
import StatsItem from "./StatsItem/StatsItem";

interface StatsBoxProps {
  moneroHashRate: string;
  shaHashRate: string;
  tariRandomXHashRate: string;
  cuckarooHashRate: string;
  averageBlockTime: string;
  blockHeight: string;
}

function StatsDesktop({
  moneroHashRate,
  shaHashRate,
  tariRandomXHashRate,
  cuckarooHashRate,
  averageBlockTime,
  blockHeight,
}: StatsBoxProps) {
  return (
    <Wrapper>
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
            Cuckaroo29
            <br />
            Hash Rate
          </>
        }
        value={cuckarooHashRate}
      />
      <StatsItem
        label={
          <>
            Average
            <br />
            Block Time
          </>
        }
        value={averageBlockTime}
        lowerCase
      />
      <StatsItem
        label={
          <>
            Block
            <br />
            Height
          </>
        }
        value={blockHeight}
      />
    </Wrapper>
  );
}

export default StatsDesktop;
