import { ValueTypography, LabelTypography } from "./StatsItem.styles";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

interface Props {
  label: React.ReactNode;
  value: string;
  lowerCase?: boolean;
}

export function StatsItems({ stats }: { stats: Props[] }) {
  const renderContent = stats.map(({ label, value, lowerCase }) => {
    return (
      <>
        <Stack key={label as string} direction="row" alignItems="baseline" spacing={0.5}>
          <LabelTypography>{label}</LabelTypography>
          <ValueTypography lowerCase={lowerCase}>{value}</ValueTypography>
        </Stack>
        {label !== stats[stats.length - 1].label && (
          <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
        )}
      </>
    );
  });
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {renderContent}
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
