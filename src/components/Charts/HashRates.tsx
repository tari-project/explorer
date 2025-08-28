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
import { formatHash } from "@utils/helpers";
import { useState, useEffect } from "react";
import { Alert, Skeleton } from "@mui/material";
import { TransparentBg } from "@components/StyledComponents";

interface HashRatesProps {
  type: "RandomX" | "Sha3" | "TariRandomX" | "Cuckaroo29";
}

interface Display {
  blockNumber: number;
  hashRate: number;
}

const HashRates: React.FC<HashRatesProps> = ({ type }) => {
  const { data, isLoading, isError, error } = useAllBlocks();
  const theme = useTheme();
  const tip = data?.tipInfo?.metadata.best_block_height;
  const [display, setDisplay] = useState<Display[]>([{ blockNumber: 0, hashRate: 0 }]);
  const [noOfBlocks, setNoOfBlocks] = useState(180);
  const zoomAmount = 20;
  const name = type;
  const colorMap: { [key: string]: string } = {
    RandomX: chartColor[4],
    Sha3: chartColor[3],
    Cuckaroo29: chartColor[1],
    default: chartColor[2],
  };

  const color = colorMap[type] || colorMap["default"];
  const minValue = display
    .map((item) => item.hashRate)
    .reduce((acc, cur) => {
      if (cur === 0) {
        return acc;
      }
      return acc === 0 ? cur : Math.min(acc, cur);
    }, 0);
  const minValueWithMargin = minValue * 0.98;

  function generateDataArray(amount: number) {
    const dataArray = [];
    for (let i = 1; i <= amount; i++) {
      dataArray.push(i.toString());
    }
    return dataArray;
  }

  useEffect(() => {
    const hashRatesMap: { [key: string]: number[] } = {
      RandomX: data?.moneroRandomxHashRates || [],
      Sha3: data?.sha3xHashRates || [],
      TariRandomX: data?.tariRandomxHashRates || [],
      Cuckaroo29: data?.cuckarooHashRates || [],
    };
    const display: Display[] = [];
    const ascendingBlockNumbers: number[] = [];
    const blockItem = parseInt(tip, 10) - noOfBlocks + 1;
    const hashRates = hashRatesMap[type];

    // Populate ascendingBlockNumbers array
    for (let i = 0; i < noOfBlocks; i++) {
      ascendingBlockNumbers.push(blockItem + i);
    }

    for (let i = 1; i <= noOfBlocks; i++) {
      if (hashRates?.[i - 1] !== 0) {
        display.push({
          blockNumber: ascendingBlockNumbers[i - 1],
          hashRate: hashRates?.[i - 1] || 0,
        });
      } else {
        setNoOfBlocks((prevState) => prevState - 1);
      }
    }
    setDisplay(display);
  }, [data, noOfBlocks, tip, type]);

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params: Array<{ seriesName: string; value: number; dataIndex: number }>) => {
        const tooltipContent = params.map((param: { seriesName: string; value: number; dataIndex: number }) => {
          const seriesName = param.seriesName;
          const value = formatHash(param.value, 2);
          return `${seriesName}: ${value}`;
        });
        const blockNumber = display[params[0].dataIndex].blockNumber;
        return `<b>Block ${blockNumber}</b><br/>${tooltipContent.join("<br/>")}`;
      },
    },
    legend: {
      data: [name],
      textStyle: {
        color: theme.palette.text.primary,
      },
      top: "0",
      right: "0",
    },
    color,
    grid: {
      left: "2%",
      right: "2%",
      bottom: "20%",
      top: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: generateDataArray(noOfBlocks),
      axisLine: {
        lineStyle: {
          color: theme.palette.text.primary,
        },
      },
      axisLabel: {
        formatter: (value: string) => {
          const index = parseInt(value, 10) - 1;
          if (display && display[index]) {
            return display[index].blockNumber;
          }
          return "";
        },
      },
    },
    yAxis: {
      type: "value",
      boundaryGap: ["10%", "10%"],
      min: minValueWithMargin,
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
        formatter: (value: number) => formatHash(value, 2),
      },
    },
    dataZoom: [
      {
        type: "slider",
        start: noOfBlocks - zoomAmount,
        end: noOfBlocks,
      },
      {
        type: "inside",
        start: noOfBlocks - zoomAmount,
        end: noOfBlocks,
      },
    ],
    series: [
      {
        name,
        type: "line",
        smooth: false,
        data: display.map((item) => item.hashRate),
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

export default HashRates;
