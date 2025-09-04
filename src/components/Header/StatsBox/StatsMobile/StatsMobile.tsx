import {
  StatsWrapperSml,
  StatsRowSml,
  StatsMobileContainer,
  ToggleContainer,
  ToggleButton,
  ToggleIcon,
} from "./StatsMobile.styles";
import StatsItem, { StatsItems } from "./StatsItem/StatsItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Collapse from "@mui/material/Collapse";
import { useMainStore } from "@services/stores/useMainStore";

interface StatsBoxProps {
  moneroHashRate: string;
  shaHashRate: string;
  tariRandomXHashRate: string;
  cuckarooHashRate: string;
  averageBlockTime: string;
  blockHeight: string;
}

function StatsMobile({
  moneroHashRate,
  shaHashRate,
  tariRandomXHashRate,
  cuckarooHashRate,
  averageBlockTime,
  blockHeight,
}: StatsBoxProps) {
  const { showStats, setShowStats } = useMainStore();

  return (
    <StatsMobileContainer>
      <ToggleContainer>
        <ToggleButton onClick={() => setShowStats(!showStats)}>
          <ToggleIcon component={showStats ? KeyboardArrowDownIcon : KeyboardArrowUpIcon} />
        </ToggleButton>
      </ToggleContainer>
      <Collapse in={showStats}>
        <StatsWrapperSml>
          <StatsRowSml>
            <Typography
              variant="h6"
              style={{
                textTransform: "uppercase",
                color: "#fff",
                lineHeight: "1.2",
              }}
            >
              Hash Rates
            </Typography>
            <StatsItems
              stats={[
                { label: "Tari RandomX:", value: tariRandomXHashRate },
                { label: "Sha3X:", value: shaHashRate },
                { label: "RandomX:", value: moneroHashRate },
                { label: "Cuckaroo29:", value: cuckarooHashRate },
              ]}
            />
          </StatsRowSml>
          <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
          <StatsRowSml>
            <Typography
              variant="h6"
              style={{
                textTransform: "uppercase",
                color: "#fff",
                lineHeight: "1.2",
              }}
            >
              Network Stats
            </Typography>
            <StatsItem label="Block Height:" value={blockHeight} />
            <StatsItem label="Avg Block Time:" value={averageBlockTime} lowerCase />
          </StatsRowSml>
        </StatsWrapperSml>
      </Collapse>
    </StatsMobileContainer>
  );
}

export default StatsMobile;
