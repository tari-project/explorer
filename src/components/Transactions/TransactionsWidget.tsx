import { Stack, Typography, Grid } from '@mui/material';
import TxnIcon1 from './images/icon-txns-1.svg';
import TxnIcon2 from './images/icon-txns-2.svg';
import { formatNumber } from '@utils/helpers';
import {
  NumberTypography,
  Line,
  IconWrapper,
} from './TransactionsWidget.styles';
import {
  useAllBlocks,
  useGetBlockByHeightOrHash,
} from '@services/api/hooks/useBlocks';
import FetchStatusCheck from '@components/FetchStatusCheck';
import { GradientPaper } from '@components/StyledComponents';
import { useMainStore } from '@services/stores/useMainStore';
import DotLoader from '@components/DotLoader';

interface TransactionsWidgetProps {
  type: 'day' | 'all';
}

function TransactionsWidget() {
  const isMobile = useMainStore((state) => state.isMobile);
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
      icon: (
        <img
          src={TxnIcon1}
          alt="Transactions Icon"
          width="30px"
          height="30px"
        />
      ),
      label: 'Last 24 Hours',
    },
    all: {
      amount: allTimeVolume,
      tooltip: 'transactions all time',
      icon: (
        <img
          src={TxnIcon2}
          alt="Transactions Icon"
          width="30px"
          height="30px"
        />
      ),
      label: 'All Time',
    },
  };

  function TransactionsMobile({ type }: TransactionsWidgetProps) {
    const { amount, label } = config[type];
    return (
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="body2" textTransform="uppercase">
          {label}:
        </Typography>
        {blocksIsLoading || blockStartIsLoading ? (
          <DotLoader />
        ) : (
          <Typography variant="h6" textTransform="uppercase">
            {formatNumber(amount)}
          </Typography>
        )}
      </Stack>
    );
  }

  function TransactionsDesktop({ type }: TransactionsWidgetProps) {
    const { amount, icon, label } = config[type];
    return (
      <Stack
        direction="row"
        spacing={0.75}
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
          <IconWrapper>{icon}</IconWrapper>
          {blocksIsLoading || blockStartIsLoading ? (
            <Stack justifyContent="center" alignItems="center" width="90px">
              <DotLoader />
            </Stack>
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
    );
  }

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

  if (isMobile) {
    return (
      <GradientPaper
        style={{
          borderRadius: '40px',
          padding: '4px',
        }}
      >
        <IconWrapper>{config.day.icon}</IconWrapper>
        <Stack
          direction="column"
          spacing={-1.5}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h6" textTransform="uppercase">
            Transactions
          </Typography>
          <TransactionsMobile type="day" />
          <TransactionsMobile type="all" />
        </Stack>
      </GradientPaper>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <GradientPaper
          style={{
            width: '100%',
            padding: '12px 8px',
            borderRadius: '40px',
          }}
        >
          <TransactionsDesktop type="day" />
        </GradientPaper>
      </Grid>

      <Grid item xs={12} md={6}>
        <GradientPaper
          style={{
            width: '100%',
            padding: '12px 8px',
            borderRadius: '40px',
          }}
        >
          <TransactionsDesktop type="all" />
        </GradientPaper>
      </Grid>
    </Grid>
  );
}

export default TransactionsWidget;
