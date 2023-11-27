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

const HashRates = () => {
  const { data } = useAllBlocks();
  const theme = useTheme();

  function generateDataArray(amount: number) {
    const dataArray = [];
    for (let i = 1; i <= amount; i++) {
      dataArray.push(i.toString());
    }
    return dataArray;
  }

  const option = {
    title: {
      text: 'HASH RATES',
      textStyle: {
        color: theme.palette.text.primary,
        fontSize: theme.typography.h6.fontSize,
        fontFamily: 'AvenirMedium',
        fontWeight: 'normal',
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['All', 'Monero', 'Sha 3'],
      textStyle: {
        color: theme.palette.text.primary,
      },
    },
    color: [
      chartColor[1],
      chartColor[2],
      chartColor[3],
      chartColor[4],
      chartColor[5],
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: generateDataArray(25),
      axisLine: {
        lineStyle: {
          color: theme.palette.text.primary,
        },
      },
    },
    yAxis: {
      type: 'value',
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
    series: [
      {
        name: 'All',
        type: 'line',
        smooth: true,
        data: data?.totalHashRates,
      },
      {
        name: 'Monero',
        type: 'line',
        smooth: true,
        data: data?.moneroHashRates,
      },
      {
        name: 'Sha 3',
        type: 'line',
        smooth: true,
        data: data?.shaHashRates,
      },
    ],
  };

  return <ReactEcharts option={option} />;
};

export default HashRates;
