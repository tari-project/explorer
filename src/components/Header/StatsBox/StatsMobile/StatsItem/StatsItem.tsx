import { ValueTypography, LabelTypography } from "./StatsItem.styles";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Props {
  label: React.ReactNode;
  value: string;
  lowerCase?: boolean;
}

export function StatsItems({ stats }: { stats: Props[] }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.between("xs", 500));

  if (isSmallScreen) {
    return (
      <Stack direction="column" spacing={0.5}>
        {stats.map(({ label, value, lowerCase }, index) => (
          <Stack key={index} direction="row" alignItems="baseline" spacing={0.5}>
            <LabelTypography>{label}</LabelTypography>
            <ValueTypography lowerCase={lowerCase}>{value}</ValueTypography>
          </Stack>
        ))}
      </Stack>
    );
  }

  const pairs = [];
  for (let i = 0; i < stats.length; i += 2) {
    pairs.push(stats.slice(i, i + 2));
  }

  return (
    <Stack spacing={0.5}>
      {pairs.map((pair, pairIndex) => (
        <Stack key={pairIndex} direction="row" alignItems="center" spacing={0.5}>
          {pair.map(({ label, value, lowerCase }, index) => (
            <>
              <Stack key={index} direction="row" alignItems="baseline" spacing={0.5}>
                <LabelTypography>{label}</LabelTypography>
                <ValueTypography lowerCase={lowerCase}>{value}</ValueTypography>
              </Stack>
              {index === 0 && pair.length === 2 && (
                <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
              )}
            </>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}

export default function StatsItem({ label, value, lowerCase }: Props) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <LabelTypography>{label}</LabelTypography>
      <ValueTypography lowerCase={lowerCase}>{value}</ValueTypography>
    </Stack>
  );
}
