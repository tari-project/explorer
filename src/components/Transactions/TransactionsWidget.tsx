import { Stack, Typography } from '@mui/material';
import { IoStatsChart, IoAnalyticsSharp } from 'react-icons/io5';
import { formatNumber } from '@utils/helpers';
import { GradientPaper } from '@components/StyledComponents';
import {
  NumberTypography,
  Line,
  TooltipContainer,
  CustomTooltip,
  TooltipWrapper,
  IconWrapper,
} from './TransactionsWidget.styles';

interface TransactionsWidgetProps {
  type: 'day' | 'all';
}

function TransactionsWidget({ type }: TransactionsWidgetProps) {
  const config = {
    day: {
      amount: 1234,
      tooltip: 'transactions in the last 24 hours',
      icon: <IoAnalyticsSharp size={20} />,
      color: '#AE5AE5',
      label: 'Last 24 Hours',
    },
    all: {
      amount: 12345678,
      tooltip: 'transactions all time',
      icon: <IoStatsChart size={20} />,
      color: '#F28078',
      label: 'All Time',
    },
  };

  const { amount, tooltip, icon, color, label } = config[type];
  const tooltipText = `${amount.toLocaleString()} ${tooltip}`;

  return (
    <TooltipContainer>
      <TooltipWrapper>
        <CustomTooltip className="custom-tooltip">
          <Typography variant="body2" color="textSecondary">
            {tooltipText}
          </Typography>
        </CustomTooltip>
        <GradientPaper
          style={{ width: '100%', padding: '16px', cursor: 'arrow' }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <IconWrapper bgcolor={color}>{icon}</IconWrapper>
            <NumberTypography variant="h4">
              {formatNumber(amount)}
            </NumberTypography>
            <Line type={type} />
            <Stack spacing={-1}>
              <Typography variant="h6" textTransform="uppercase">
                Transactions
              </Typography>
              <Typography variant="body2" textTransform="uppercase">
                {label}
              </Typography>
            </Stack>
          </Stack>
        </GradientPaper>
      </TooltipWrapper>
    </TooltipContainer>
  );
}

export default TransactionsWidget;
