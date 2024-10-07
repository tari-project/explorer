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

interface BlockTimesProps {
  type: 'RandomX' | 'Sha3' | 'All';
}

const BlockTimes: React.FC<BlockTimesProps> = ({ type }) => {
  const { data } = useAllBlocks();
  const theme = useTheme();
  const tip = data?.tipInfo?.metadata.best_block_height;
  const noOfBlocks = 60;
  const zoomAmount = 30;

  const name = type;
  const colorMap: { [key: string]: string } = {
    RandomX: chartColor[2],
    Sha3: chartColor[3],
    default: chartColor[1],
  };

  const blockTimesMap: { [key: string]: any[] } = {
    RandomX: data?.moneroTimes,
    Sha3: data?.shaTimes,
    default: data?.blockTimes || [],
  };

  const color = colorMap[type] || colorMap['default'];
  const blockTimes = blockTimesMap[type] || blockTimesMap['default'];

  const blockNumbers = new Array();
  let blockItem = parseInt(tip, 10);
  for (let i = 1; i <= noOfBlocks; i++) {
    blockNumbers.push(blockItem);
    blockItem = blockItem - 1;
  }

  function generateDataArray(amount: number) {
    const dataArray = [];
    for (let i = 1; i <= amount; i++) {
      dataArray.push(i.toString());
    }
    return dataArray;
  }

  const option = {
    animation: false,
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const tooltipContent = params.map((param: any) => {
          const seriesName = param.seriesName;
          const value = param.value;
          return `${seriesName}: ${value.toFixed(2)}m`;
        });
        const blockNumber = blockNumbers?.[params[0].dataIndex];
        return `<b>Block ${blockNumber}</b><br/>${tooltipContent.join(
          '<br/>'
        )}`;
      },
    },
    legend: {
      data: [name],
      textStyle: {
        color: theme.palette.text.primary,
      },
      top: '0',
      right: '0',
    },
    color,
    grid: {
      left: '2%',
      right: '2%',
      bottom: '20%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: generateDataArray(noOfBlocks),
      inverse: true,
      axisLine: {
        lineStyle: {
          color: theme.palette.text.primary,
        },
      },
      axisLabel: {
        formatter: (value: string) => {
          return blockNumbers?.[parseInt(value, 10) - 1];
        },
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: ['10%', '10%'],
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
      axisLabel: {
        formatter: (value: number) => value + 'm',
      },
    },
    dataZoom: [
      {
        type: 'slider',
        start: 0,
        end: (zoomAmount / noOfBlocks) * 100,
      },
      {
        type: 'inside',
        start: 0,
        end: (zoomAmount / noOfBlocks) * 100,
      },
    ],
    series: [
      {
        name,
        type: 'line',
        smooth: false,
        data: blockTimes,
      },
    ],
  };

  return <ReactEcharts option={option} />;
};

export default BlockTimes;
