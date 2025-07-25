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

import { toHexString } from '@utils/helpers';

export const kernelItems = (content: any) => {
  const items = [
    {
      label: 'Features',
      value: content.features,
      copy: false,
    },
    {
      label: 'Fee',
      value: content.fee / 1_000_000 + ' XTM',
      copy: false,
    },
    {
      label: 'Lock Height',
      value: content.lock_height,
      copy: false,
    },
    {
      label: 'Excess',
      value: toHexString(content.excess?.data),
      copy: true,
    },
    {
      label: 'Excess Sig',
      copy: false,
      children: [
        {
          label: 'Public Nonce',
          value: toHexString(content.excess_sig.public_nonce?.data),
          copy: true,
        },
        {
          label: 'Signature',
          value: toHexString(content.excess_sig.signature?.data),
          copy: true,
        },
      ],
    },
    {
      label: 'Hash',
      value: toHexString(content.hash?.data),
      copy: true,
      header: false,
    },
    {
      label: 'Version',
      value: content.version,
      copy: false,
    },
  ];

  return items;
};
