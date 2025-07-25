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
import { useAllBlocks } from '@services/api/hooks/useBlocks';
import { Alert, Skeleton } from '@mui/material';
import { TransparentBg } from '@components/StyledComponents';

interface AlgoSplit {
  moneroRx10: number;
  moneroRx20: number;
  moneroRx50: number;
  moneroRx100: number;
  sha3X10: number;
  sha3X20: number;
  sha3X50: number;
  sha3X100: number;
  tariRx10: number;
  tariRx20: number;
  tariRx50: number;
  tariRx100: number;
}

const ProofOfWork = () => {
  const theme = useTheme();
  const { data, isError, isLoading, error } = useAllBlocks();

  function calculatePercentage(monero: number, sha: number, tari:number) {
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

  const moneroRx = {
    10: calculatePercentage(data?.algoSplit.moneroRx10, data?.algoSplit.sha3X10, data?.algoSplit.tariRx10)[0],
    20: calculatePercentage(data?.algoSplit.moneroRx20, data?.algoSplit.sha3X20, data?.algoSplit.tariRx20)[0],
    50: calculatePercentage(data?.algoSplit.moneroRx50, data?.algoSplit.sha3X50, data?.algoSplit.tariRx50)[0],
    100: calculatePercentage(
      data?.algoSplit.moneroRx100,
      data?.algoSplit.sha3X100,
      data?.algoSplit.tariRx100,
    )[0],
  };

  const sha3X = {
    10: calculatePercentage(data?.algoSplit.moneroRx10, data?.algoSplit.sha3X10, data?.algoSplit.tariRx10)[1],
    20: calculatePercentage(data?.algoSplit.moneroRx20, data?.algoSplit.sha3X20, data?.algoSplit.tariRx20)[1],
    50: calculatePercentage(data?.algoSplit.moneroRx50, data?.algoSplit.sha3X50, data?.algoSplit.tariRx50)[1],
    100: calculatePercentage(
      data?.algoSplit.moneroRx100,
      data?.algoSplit.sha3X100,
      data?.algoSplit.tariRx100
    )[1],
  };
  const tariRx = {
    10: calculatePercentage(data?.algoSplit.moneroRx10, data?.algoSplit.sha3X10, data?.algoSplit.tariRx10)[2],
    20: calculatePercentage(data?.algoSplit.moneroRx20, data?.algoSplit.sha3X20, data?.algoSplit.tariRx20)[2],
    50: calculatePercentage(data?.algoSplit.moneroRx50, data?.algoSplit.sha3X50, data?.algoSplit.tariRx50)[2],
    100: calculatePercentage(
      data?.algoSplit.moneroRx100,
      data?.algoSplit.sha3X100,
      data?.algoSplit.tariRx100
    )[2],
  };

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params: any) {
        const moneroBlocks =
          data?.algoSplit[`moneroRx${params[0].name}` as keyof AlgoSplit];
        const shaBlocks =
          data?.algoSplit[`sha3X${params[0].name}` as keyof AlgoSplit];
        const tariBlocks =
          data?.algoSplit[`tariRx${params[0].name}` as keyof AlgoSplit];
        const moneroColor = params[0].color;
        const shaColor = params[1].color;
        const tariColor = params[2].color;
        return `
          <b>In the last ${params[0].name} blocks:</b><br />
          <span style="color:${moneroColor};"></span>RandomX: ${moneroBlocks} blocks (${params[0].value}%)<br />
          <span style="color:${shaColor};"></span>Sha 3: ${shaBlocks} blocks (${params[1].value}%)
          <span style="color:${tariColor};"></span>Tari RandomX: ${tariBlocks} blocks (${params[2].value}%)
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
        data: [moneroRx[100], moneroRx[50], moneroRx[20], moneroRx[10]],
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
        data: [sha3X[100], sha3X[50], sha3X[20], sha3X[10]],
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
        data: [tariRx[100], tariRx[50], tariRx[20], tariRx[10]],
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
