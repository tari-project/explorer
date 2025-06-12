import { Stack, Typography, CircularProgress } from '@mui/material';
import { IoStatsChart, IoAnalyticsSharp } from 'react-icons/io5';
import { formatNumber } from '@utils/helpers';
import {
  NumberTypography,
  Line,
  TooltipContainer,
  CustomTooltip,
  TooltipWrapper,
  IconWrapper,
} from './TransactionsWidget.styles';
import {
  useAllBlocks,
  useGetBlockByHeightOrHash,
} from '@services/api/hooks/useBlocks';
import FetchStatusCheck from '@components/FetchStatusCheck';
import { GradientPaper } from '@components/StyledComponents';

interface TransactionsWidgetProps {
  type: 'day' | 'all';
}

function TransactionsWidget({ type }: TransactionsWidgetProps) {
  const {
    data: blocks,
    isLoading: blocksIsLoading,
    isError: blocksIsError,
  } = useAllBlocks();
  const tip = blocks?.headers[0]?.height;
  const coinbases = 720;
  const {
    data: blockStart,
    isLoading: blockStartIsLoading,
    isError: blockStartIsError,
  } = useGetBlockByHeightOrHash((parseInt(tip) - coinbases).toString());
  const tipKernelMMR = blocks?.headers[0]?.kernel_mmr_size || 0;
  const prevKernelMMR = blockStart?.header?.kernel_mmr_size || 0;

  function calculateVolume(
    tipKernelMMR: number,
    prevKernelMMR: number,
    coinbases: number
  ): number {
    if (tipKernelMMR === 0 || prevKernelMMR === 0) return 0;
    return tipKernelMMR - prevKernelMMR - coinbases;
  }

  const volume24h = calculateVolume(tipKernelMMR, prevKernelMMR, coinbases);
  const allTimeVolume = calculateVolume(tipKernelMMR, tip, 0);

  const config = {
    day: {
      amount: volume24h,
      tooltip: 'transactions in the last 24 hours',
      icon: <IoAnalyticsSharp size={20} />,
      color: '#AE5AE5',
      label: 'Last 24 Hours',
    },
    all: {
      amount: allTimeVolume,
      tooltip: 'transactions all time',
      icon: <IoStatsChart size={20} />,
      color: '#F28078',
      label: 'All Time',
    },
  };

  const { amount, tooltip, icon, color, label } = config[type];
  const tooltipText = `${amount.toLocaleString()} ${tooltip}`;

  if (blocksIsError || blockStartIsError) {
    return (
      <GradientPaper
        style={{ width: '100%', padding: '16px', cursor: 'arrow' }}
      >
        <FetchStatusCheck
          isLoading={blocksIsLoading || blockStartIsLoading}
          isError={blocksIsError || blockStartIsError}
          errorMessage="Error retrieving data"
        />
      </GradientPaper>
    );
  }

  return (
    <GradientPaper style={{ width: '100%', padding: '16px', cursor: 'arrow' }}>
      <TooltipContainer>
        <TooltipWrapper>
          <CustomTooltip className="custom-tooltip">
            <Typography variant="body2" color="textSecondary">
              {tooltipText}
            </Typography>
          </CustomTooltip>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <Stack
              direction={'row'}
              spacing={1}
              alignItems="center"
              justifyContent={'flex-end'}
              minWidth={'120px'}
            >
              <IconWrapper bgcolor={color}>{icon}</IconWrapper>
              {blocksIsLoading || blockStartIsLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <NumberTypography variant="h4">
                  {formatNumber(amount)}
                </NumberTypography>
              )}
            </Stack>
            <Line type={type} />
            <Stack spacing={-1.4}>
              <Typography variant="h6" textTransform="uppercase">
                Transactions
              </Typography>
              <Typography variant="body2" textTransform="uppercase">
                {label}
              </Typography>
            </Stack>
          </Stack>
        </TooltipWrapper>
      </TooltipContainer>
    </GradientPaper>
  );
}

export default TransactionsWidget;
