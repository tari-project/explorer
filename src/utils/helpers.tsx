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

import { ChangeEvent } from "react";

const renderJson = (json: unknown): React.ReactNode => {
  if (Array.isArray(json)) {
    if (json.length == 32) {
      return <span className="string">"{toHexString(json)}"</span>;
    }
    return (
      <>
        [
        <ol>
          {json.map((val, idx) => (
            <li key={idx}>{renderJson(val)},</li>
          ))}
        </ol>
        ],
      </>
    );
  } else if (typeof json === "object" && json !== null) {
    const obj = json as Record<string, unknown>;
    return (
      <>
        {"{"}
        <ul>
          {Object.keys(obj).map((key) => (
            <li key={key}>
              <b>"{key}"</b>:{renderJson(obj[key])}
            </li>
          ))}
        </ul>
        {"}"}
      </>
    );
  } else {
    if (typeof json === "string") return <span className="string">"{json}"</span>;
    return <span className="other">{String(json)}</span>;
  }
};

function removeTagged(obj: unknown): unknown {
  if (obj === undefined) {
    return "undefined";
  }
  if (typeof obj === "object" && obj !== null) {
    const rec = obj as Record<string, unknown>;
    if (rec["@@TAGGED@@"] !== undefined) {
      const tagged = rec["@@TAGGED@@"] as unknown[];
      return tagged[1];
    }
  }
  return obj;
}

function toHexString(byteArray: unknown): string {
  if (Array.isArray(byteArray)) {
    return Array.from(byteArray, function (byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
  }
  if (byteArray === undefined) {
    return "undefined";
  }
  if (
    typeof byteArray === "object" &&
    byteArray !== null &&
    (byteArray as Record<string, unknown>)["@@TAGGED@@"] !== undefined
  ) {
    const tagged = (byteArray as Record<string, unknown>)["@@TAGGED@@"] as unknown[];
    return toHexString(tagged[1] as number[]);
  }
  // Only allow arrays, tagged objects, or undefined. All else unsupported.
  return "Unsupported type";
}

function fromHexString(hexString: string) {
  const res: number[] = [];
  for (let i = 0; i < hexString.length; i += 2) {
    res.push(Number("0x" + hexString.substring(i, i + 2)));
  }
  return res;
}

function shortenString(string: string, start: number = 8, end: number = 8) {
  return string.substring(0, start) + "..." + string.slice(-end);
}

function emptyRows(page: number, rowsPerPage: number, array: unknown[]) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - array.length) : 0;
}

function handleChangePage(newPage: number, setPage: React.Dispatch<React.SetStateAction<number>>) {
  setPage(newPage);
}

function handleChangeRowsPerPage(
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>,
  setPage: React.Dispatch<React.SetStateAction<number>>
) {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
}

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function validateHeight(height: string): boolean {
  const regex = /^\d+$/;
  return regex.test(height);
}

function validateHash(hash: string): boolean {
  const regex = /^[a-fA-F0-9]{64}$/;
  return regex.test(hash);
}

function formatHash(number: number, decimals: number = 1) {
  const suffixes = ["", "K", "M", "G", "T", "P"];
  let suffixIndex = 0;
  while (number >= 1000 && suffixIndex < suffixes.length - 1) {
    number /= 1000;
    suffixIndex++;
  }
  return number.toFixed(decimals) + suffixes[suffixIndex] + "H";
}

function formatNumber(number: number | undefined | null, decimals: number = 2) {
  if (number === undefined || number === null) {
    return "N/A";
  }
  if (number < 1000000) {
    return number.toLocaleString();
  }
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixIndex = 0;
  while (number >= 1000 && suffixIndex < suffixes.length - 1) {
    number /= 1000;
    suffixIndex++;
  }
  return number.toFixed(decimals) + suffixes[suffixIndex];
}

function formatXTM(amount: number): string {
  return amount / 1_000_000 + " XTM";
}

function formatC29(hashRateGps: number, precision: number = 2): string {
  if (hashRateGps >= 1000) {
    return `${(hashRateGps / 1000).toFixed(precision)}Kg`;
  }
  return `${hashRateGps.toFixed(0)}g`;
}

function powCheck(num: string | number): string {
  if (typeof num === "number") {
    num = num.toString();
  }
  let powText = "";
  switch (num) {
    case "0":
      powText = "RandomX (Merge Mined)";
      break;
    case "1":
      powText = "SHA3x";
      break;
    case "2":
      powText = "RandomX";
      break;
    case "3":
      powText = "Cuckaroo29";
      break;
    default:
      powText = "Unknown";
      break;
  }
  return powText;
}

export {
  renderJson,
  toHexString,
  fromHexString,
  shortenString,
  removeTagged,
  emptyRows,
  handleChangePage,
  handleChangeRowsPerPage,
  formatTimestamp,
  validateHash,
  validateHeight,
  formatHash,
  formatXTM,
  formatNumber,
  formatC29,
  powCheck,
};
