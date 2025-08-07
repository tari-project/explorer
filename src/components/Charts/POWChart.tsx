//  Copyright 2022. The Tari Project
//
//  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
//  following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
//  disclaimer.
//
//  2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
//  following disclaimer in the documentation and/or other materials provided with the distribution.
//
//  3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
//  products derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
//  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
//  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
//  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
//  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
//  USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import ReactEcharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { chartColor } from '@theme/colors';
import { useGetBlocksByParam } from '@services/api/hooks/useBlocks';
import { Alert, Skeleton } from '@mui/material';
import { TransparentBg } from '@components/StyledComponents';
import { useMainStore } from '@services/stores/useMainStore';
import { useMemo } from 'react';

interface Header {
  pow: {
    pow_algo: string;
  };
  powText: string;
  height?: number;
}

const ProofOfWork = () => {
  const theme = useTheme();
  const tip = useMainStore((state) => state.tip);
  const {
    data: blocksData,
    isError,
    isLoading,
    error,
  } = useGetBlocksByParam(tip, 90);

  const headers = blocksData?.headers || [];
  const pows = headers.map((header: Header) => {
    return { header: header.pow.pow_algo, powText: header.powText };
  });

  function calculateAlgoSplit(
    powsData: Array<{ header: string; powText: string }>,
    count: number
  ) {
    const recentPows = [...powsData].reverse().slice(-count);
    const counts = {
      moneroRx: 0,
      sha3X: 0,
      tariRx: 0,
    };

    recentPows.forEach((pow) => {
      const algo = pow.header;
      if (algo === '0') {
        counts.moneroRx++;
      } else if (algo === '1') {
        counts.sha3X++;
      } else if (algo === '2') {
        counts.tariRx++;
      }
    });

    return counts;
  }

  function calculatePercentage(monero: number, sha: number, tari: number) {
    const total = monero + sha + tari;
    let moneroPercentage = Math.round((monero / total) * 100);
    let shaPercentage = Math.round((sha / total) * 100);
    const tariPercentage = Math.round((tari / total) * 100);
    const diff = 100 - (moneroPercentage + shaPercentage + tariPercentage);
    if (diff > 0) {
      moneroPercentage += diff;
    } else if (diff < 0) {
      shaPercentage += diff;
    }
    return [moneroPercentage, shaPercentage, tariPercentage];
  }

  const { moneroRx, sha3X, tariRx, splitsMap } = useMemo(() => {
    const split10 = calculateAlgoSplit(pows, 10);
    const split20 = calculateAlgoSplit(pows, 20);
    const split50 = calculateAlgoSplit(pows, 50);
    const split90 = calculateAlgoSplit(pows, 90);

    const moneroRx = {
      10: calculatePercentage(
        split10.moneroRx,
        split10.sha3X,
        split10.tariRx
      )[0],
      20: calculatePercentage(
        split20.moneroRx,
        split20.sha3X,
        split20.tariRx
      )[0],
      50: calculatePercentage(
        split50.moneroRx,
        split50.sha3X,
        split50.tariRx
      )[0],
      90: calculatePercentage(
        split90.moneroRx,
        split90.sha3X,
        split90.tariRx
      )[0],
    };

    const sha3X = {
      10: calculatePercentage(
        split10.moneroRx,
        split10.sha3X,
        split10.tariRx
      )[1],
      20: calculatePercentage(
        split20.moneroRx,
        split20.sha3X,
        split20.tariRx
      )[1],
      50: calculatePercentage(
        split50.moneroRx,
        split50.sha3X,
        split50.tariRx
      )[1],
      90: calculatePercentage(
        split90.moneroRx,
        split90.sha3X,
        split90.tariRx
      )[1],
    };

    const tariRx = {
      10: calculatePercentage(
        split10.moneroRx,
        split10.sha3X,
        split10.tariRx
      )[2],
      20: calculatePercentage(
        split20.moneroRx,
        split20.sha3X,
        split20.tariRx
      )[2],
      50: calculatePercentage(
        split50.moneroRx,
        split50.sha3X,
        split50.tariRx
      )[2],
      90: calculatePercentage(
        split90.moneroRx,
        split90.sha3X,
        split90.tariRx
      )[2],
    };

    const splitsMap = {
      '10': split10,
      '20': split20,
      '50': split50,
      '90': split90,
    };

    return { moneroRx, sha3X, tariRx, splitsMap };
  }, [pows]);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (
        params: Array<{ name: string; color: string; value: number }>
      ) {
        const split = splitsMap[params[0].name as keyof typeof splitsMap];
        const moneroBlocks = split.moneroRx;
        const shaBlocks = split.sha3X;
        const tariBlocks = split.tariRx;
        const moneroColor = params[0].color;
        const shaColor = params[1].color;
        const tariColor = params[2].color;
        return `
          <b>In the last ${params[0].name} blocks:</b><br />
          <span style="color:${moneroColor};"></span>RandomX (Merge Mined): ${moneroBlocks} block${
          moneroBlocks > 1 ? 's' : ''
        } (${params[0].value}%)<br />
          <span style="color:${shaColor};"></span>Sha 3: ${shaBlocks} block${
          shaBlocks > 1 ? 's' : ''
        } (${params[1].value}%)<br />
          <span style="color:${tariColor};"></span>Tari RandomX: ${tariBlocks} block${
          tariBlocks > 1 ? 's' : ''
        } (${params[2].value}%)
        `;
      },
    },
    legend: {
      textStyle: {
        color: theme.palette.text.primary,
      },
      bottom: 10,
    },
    color: [chartColor[4], chartColor[3], chartColor[2]],
    grid: {
      left: '2%',
      right: '2%',
      bottom: '15%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      label: {
        color: theme.palette.text.primary,
        label: {
          show: true,
        },
        text: 'Percentage',
      },
      axisLine: {
        lineStyle: {
          color: theme.palette.text.primary,
        },
      },
      splitLine: {
        lineStyle: {
          color: theme.palette.divider,
        },
      },
    },
    yAxis: {
      type: 'category',
      axisLabel: {
        formatter: 'Last {value} blocks}',
      },
      data: ['90', '50', '20', '10'],
      axisLine: {
        lineStyle: {
          color: theme.palette.text.primary,
        },
      },
    },
    series: [
      {
        name: 'RandomX (MM)',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: `{c}%`,
          padding: [0, 10, 0, 10],
        },
        emphasis: {
          focus: 'series',
        },
        data: [moneroRx[90], moneroRx[50], moneroRx[20], moneroRx[10]],
      },
      {
        name: 'Sha 3',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: `{c}%`,
        },
        emphasis: {
          focus: 'series',
        },
        data: [sha3X[90], sha3X[50], sha3X[20], sha3X[10]],
      },
      {
        name: 'Tari RandomX',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: `{c}%`,
        },
        emphasis: {
          focus: 'series',
        },
        data: [tariRx[90], tariRx[50], tariRx[20], tariRx[10]],
      },
    ],
  };

  if (isError) {
    return (
      <TransparentBg>
        <Alert severity="error" variant="outlined">
          {error?.message}
        </Alert>
      </TransparentBg>
    );
  }

  if (isLoading) {
    return <Skeleton variant="rounded" height={300} />;
  }

  return <ReactEcharts option={option} />;
};

export default ProofOfWork;
