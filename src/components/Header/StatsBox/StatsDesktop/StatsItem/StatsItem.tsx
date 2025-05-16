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
      <ValueTypography lowerCase={lowerCase}>{value}</ValueTypography>
      <LabelTypography>{label}</LabelTypography>
    </StyledBox>
  );
}
