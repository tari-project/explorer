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

import ReactEcharts from "echarts-for-react";
import { useTheme } from "@mui/material/styles";
import { chartColor } from "@theme/colors";
import { useAllBlocks } from "@services/api/hooks/useBlocks";
import { Alert, Skeleton } from "@mui/material";
import { TransparentBg } from "@components/StyledComponents";
import { useMediaQuery } from "@mui/material";

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
  cuckaroo10: number;
  cuckaroo20: number;
  cuckaroo50: number;
  cuckaroo100: number;
}

const ProofOfWork = () => {
  const theme = useTheme();
  const { data, isError, isLoading, error } = useAllBlocks();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  function calculatePercentage(monero: number, sha: number, tari: number, cuckaroo: number) {
    const total = monero + sha + tari + cuckaroo;
    let moneroPercentage = Math.round((monero / total) * 100);
    let shaPercentage = Math.round((sha / total) * 100);
    const tariPercentage = Math.round((tari / total) * 100);
    const cuckarooPercentage = Math.round((cuckaroo / total) * 100);
    const diff = 100 - (moneroPercentage + shaPercentage + tariPercentage + cuckarooPercentage);
    if (diff > 0) {
      moneroPercentage += diff;
    } else if (diff < 0) {
      shaPercentage += diff;
    }
    return [moneroPercentage, shaPercentage, tariPercentage, cuckarooPercentage];
  }

  const moneroRx = {
    10: calculatePercentage(
      data?.algoSplit.moneroRx10 || 0,
      data?.algoSplit.sha3X10 || 0,
      data?.algoSplit.tariRx10 || 0,
      data?.algoSplit.cuckaroo10 || 0
    )[0],
    20: calculatePercentage(
      data?.algoSplit.moneroRx20 || 0,
      data?.algoSplit.sha3X20 || 0,
      data?.algoSplit.tariRx20 || 0,
      data?.algoSplit.cuckaroo20 || 0
    )[0],
    50: calculatePercentage(
      data?.algoSplit.moneroRx50 || 0,
      data?.algoSplit.sha3X50 || 0,
      data?.algoSplit.tariRx50 || 0,
      data?.algoSplit.cuckaroo50 || 0
    )[0],
    100: calculatePercentage(
      data?.algoSplit.moneroRx100 || 0,
      data?.algoSplit.sha3X100 || 0,
      data?.algoSplit.tariRx100 || 0,
      data?.algoSplit.cuckaroo100 || 0
    )[0],
  };

  const sha3X = {
    10: calculatePercentage(
      data?.algoSplit.moneroRx10 || 0,
      data?.algoSplit.sha3X10 || 0,
      data?.algoSplit.tariRx10 || 0,
      data?.algoSplit.cuckaroo10 || 0
    )[1],
    20: calculatePercentage(
      data?.algoSplit.moneroRx20 || 0,
      data?.algoSplit.sha3X20 || 0,
      data?.algoSplit.tariRx20 || 0,
      data?.algoSplit.cuckaroo20 || 0
    )[1],
    50: calculatePercentage(
      data?.algoSplit.moneroRx50 || 0,
      data?.algoSplit.sha3X50 || 0,
      data?.algoSplit.tariRx50 || 0,
      data?.algoSplit.cuckaroo50 || 0
    )[1],
    100: calculatePercentage(
      data?.algoSplit.moneroRx100 || 0,
      data?.algoSplit.sha3X100 || 0,
      data?.algoSplit.tariRx100 || 0,
      data?.algoSplit.cuckaroo100 || 0
    )[1],
  };
  const tariRx = {
    10: calculatePercentage(
      data?.algoSplit.moneroRx10 || 0,
      data?.algoSplit.sha3X10 || 0,
      data?.algoSplit.tariRx10 || 0,
      data?.algoSplit.cuckaroo10 || 0
    )[2],
    20: calculatePercentage(
      data?.algoSplit.moneroRx20 || 0,
      data?.algoSplit.sha3X20 || 0,
      data?.algoSplit.tariRx20 || 0,
      data?.algoSplit.cuckaroo20 || 0
    )[2],
    50: calculatePercentage(
      data?.algoSplit.moneroRx50 || 0,
      data?.algoSplit.sha3X50 || 0,
      data?.algoSplit.tariRx50 || 0,
      data?.algoSplit.cuckaroo50 || 0
    )[2],
    100: calculatePercentage(
      data?.algoSplit.moneroRx100 || 0,
      data?.algoSplit.sha3X100 || 0,
      data?.algoSplit.tariRx100 || 0,
      data?.algoSplit.cuckaroo100 || 0
    )[2],
  };

  const cuckaroo = {
    10: calculatePercentage(
      data?.algoSplit.moneroRx10 || 0,
      data?.algoSplit.sha3X10 || 0,
      data?.algoSplit.tariRx10 || 0,
      data?.algoSplit.cuckaroo10 || 0
    )[3],
    20: calculatePercentage(
      data?.algoSplit.moneroRx20 || 0,
      data?.algoSplit.sha3X20 || 0,
      data?.algoSplit.tariRx20 || 0,
      data?.algoSplit.cuckaroo20 || 0
    )[3],
    50: calculatePercentage(
      data?.algoSplit.moneroRx50 || 0,
      data?.algoSplit.sha3X50 || 0,
      data?.algoSplit.tariRx50 || 0,
      data?.algoSplit.cuckaroo50 || 0
    )[3],
    100: calculatePercentage(
      data?.algoSplit.moneroRx100 || 0,
      data?.algoSplit.sha3X100 || 0,
      data?.algoSplit.tariRx100 || 0,
      data?.algoSplit.cuckaroo100 || 0
    )[3],
  };

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: Array<{ name: string; color: string; value: number }>) {
        const moneroBlocks = data?.algoSplit[`moneroRx${params[0].name}` as keyof AlgoSplit] || 0;
        const shaBlocks = data?.algoSplit[`sha3X${params[0].name}` as keyof AlgoSplit] || 0;
        const tariBlocks = data?.algoSplit[`tariRx${params[0].name}` as keyof AlgoSplit] || 0;
        const cuckarooBlocks = data?.algoSplit[`cuckaroo${params[0].name}` as keyof AlgoSplit] || 0;
        const moneroColor = params[0].color;
        const shaColor = params[1].color;
        const tariColor = params[2].color;
        const cuckarooColor = params[3].color;
        return `
          <b>In the last ${params[0].name} blocks:</b><br />
          <span style="display:inline-block;width:8px;height:8px;background-color:${moneroColor};border-radius:50%;margin-right:5px;"></span>RandomX: ${moneroBlocks} ${
          moneroBlocks === 1 ? "block" : "blocks"
        } (${params[0].value}%)<br />
          <span style="display:inline-block;width:8px;height:8px;background-color:${shaColor};border-radius:50%;margin-right:5px;"></span>Sha 3: ${shaBlocks} ${
          shaBlocks === 1 ? "block" : "blocks"
        } (${params[1].value}%)<br />
          <span style="display:inline-block;width:8px;height:8px;background-color:${tariColor};border-radius:50%;margin-right:5px;"></span>Tari RandomX: ${tariBlocks} ${
          tariBlocks === 1 ? "block" : "blocks"
        } (${params[2].value}%)<br />
          <span style="display:inline-block;width:8px;height:8px;background-color:${cuckarooColor};border-radius:50%;margin-right:5px;"></span>Cuckaroo29: ${cuckarooBlocks} ${
          cuckarooBlocks === 1 ? "block" : "blocks"
        } (${params[3].value}%)
        `;
      },
    },
    legend: isMobile
      ? [
          {
            data: ["RandomX", "Sha 3"],
            textStyle: {
              color: theme.palette.text.primary,
            },
            bottom: 30,
            left: "center",
            itemGap: 20,
            itemWidth: 12,
            itemHeight: 8,
          },
          {
            data: ["Tari RandomX", "Cuckaroo29"],
            textStyle: {
              color: theme.palette.text.primary,
            },
            bottom: 10,
            left: "center",
            itemGap: 20,
            itemWidth: 12,
            itemHeight: 8,
          },
        ]
      : {
          textStyle: {
            color: theme.palette.text.primary,
          },
          bottom: 10,
        },
    color: [chartColor[4], chartColor[3], chartColor[2], chartColor[1]],
    grid: {
      left: "2%",
      right: "2%",
      bottom: isMobile ? "25%" : "15%",
      top: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      label: {
        color: theme.palette.text.primary,
        label: {
          show: true,
        },
        text: "Percentage",
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
      type: "category",
      axisLabel: {
        formatter: "Last {value} blocks",
      },
      data: ["100", "50", "20", "10"],
      axisLine: {
        lineStyle: {
          color: theme.palette.text.primary,
        },
      },
    },
    series: [
      {
        name: "RandomX",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: `{c}%`,
        },
        emphasis: {
          focus: "series",
        },
        data: [moneroRx[100], moneroRx[50], moneroRx[20], moneroRx[10]],
      },
      {
        name: "Sha 3",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: `{c}%`,
        },
        emphasis: {
          focus: "series",
        },
        data: [sha3X[100], sha3X[50], sha3X[20], sha3X[10]],
      },
      {
        name: "Tari RandomX",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: `{c}%`,
        },
        emphasis: {
          focus: "series",
        },
        data: [tariRx[100], tariRx[50], tariRx[20], tariRx[10]],
      },
      {
        name: "Cuckaroo29",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: `{c}%`,
        },
        emphasis: {
          focus: "series",
        },
        data: [cuckaroo[100], cuckaroo[50], cuckaroo[20], cuckaroo[10]],
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
