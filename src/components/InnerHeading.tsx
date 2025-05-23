import { Typography, Divider, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

interface InnerHeadingProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h3.fontSize,
  fontFamily: "'DrukHeavy', sans-serif",
  textTransform: 'uppercase',
}));

function InnerHeading({ children, icon }: InnerHeadingProps) {
  return (
    <Stack direction="column" gap={1} mb={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <StyledTypography>{children}</StyledTypography>
        {icon && (
          <Stack direction="row" alignItems="center" gap={1}>
            {icon}
          </Stack>
        )}
      </Stack>
      <Divider />
    </Stack>
  );
}

export default InnerHeading;
