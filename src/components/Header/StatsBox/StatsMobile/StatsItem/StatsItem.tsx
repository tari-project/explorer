import {
  StyledBox,
  ValueTypography,
  LabelTypography,
} from './StatsItem.styles';

interface Props {
  label: string;
  value: string;
  lowerCase?: boolean;
}

export default function StatsItem({ label, value, lowerCase }: Props) {
  return (
    <StyledBox>
      <LabelTypography>{label}</LabelTypography>
      <ValueTypography lowerCase={lowerCase}>{value}</ValueTypography>
    </StyledBox>
  );
}
