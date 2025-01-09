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
import { chartColor } from '../../theme/colors';
import { useAllBlocks } from '../../api/hooks/useBlocks';
import { Alert, Skeleton } from '@mui/material';
import { TransparentBg } from '../../components/StyledComponents';

interface AlgoSplit {
  monero10: number;
  monero20: number;
  monero50: number;
  monero100: number;
  sha10: number;
  sha20: number;
  sha50: number;
  sha100: number;
}

const ProofOfWork = () => {
  const theme = useTheme();
  const { data, isError, isLoading, error } = useAllBlocks();

  function calculatePercentage(monero: number, sha: number) {
    const total = monero + sha;
    let moneroPercentage = Math.round((monero / total) * 100);
    let shaPercentage = Math.round((sha / total) * 100);
    const diff = 100 - (moneroPercentage + shaPercentage);
    if (diff > 0) {
      moneroPercentage += diff;
    } else if (diff < 0) {
      shaPercentage += diff;
    }
    return [moneroPercentage, shaPercentage];
  }

  const monero = {
    10: calculatePercentage(data?.algoSplit.monero10, data?.algoSplit.sha10)[0],
    20: calculatePercentage(data?.algoSplit.monero20, data?.algoSplit.sha20)[0],
    50: calculatePercentage(data?.algoSplit.monero50, data?.algoSplit.sha50)[0],
    100: calculatePercentage(
      data?.algoSplit.monero100,
      data?.algoSplit.sha100
    )[0],
  };

  const sha = {
    10: calculatePercentage(data?.algoSplit.monero10, data?.algoSplit.sha10)[1],
    20: calculatePercentage(data?.algoSplit.monero20, data?.algoSplit.sha20)[1],
    50: calculatePercentage(data?.algoSplit.monero50, data?.algoSplit.sha50)[1],
    100: calculatePercentage(
      data?.algoSplit.monero100,
      data?.algoSplit.sha100
    )[1],
  };

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params: any) {
        const moneroBlocks =
          data?.algoSplit[`monero${params[0].name}` as keyof AlgoSplit];
        const shaBlocks =
          data?.algoSplit[`sha${params[0].name}` as keyof AlgoSplit];
        const moneroColor = params[0].color;
        const shaColor = params[1].color;
        return `
          <b>In the last ${params[0].name} blocks:</b><br />
          <span style="color:${moneroColor};"></span>RandomX: ${moneroBlocks} blocks (${params[0].value}%)<br />
          <span style="color:${shaColor};"></span>Sha 3: ${shaBlocks} blocks (${params[1].value}%)
        `;
      },
    },
    legend: {
      textStyle: {
        color: theme.palette.text.primary,
      },
      bottom: 10,
    },
    color: [chartColor[2], chartColor[3]],
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
        formatter: 'Last {value} blocks',
      },
      data: ['100', '50', '20', '10'],
      axisLine: {
        lineStyle: {
          color: theme.palette.text.primary,
        },
      },
    },
    series: [
      {
        name: 'RandomX',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: `{c}%`,
        },
        emphasis: {
          focus: 'series',
        },
        data: [monero[100], monero[50], monero[20], monero[10]],
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
        data: [sha[100], sha[50], sha[20], sha[10]],
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
