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

export const outputItems = (content: any) => {
  const items = [
    {
      label: 'Features',
      copy: false,
      children: [
        {
          label: 'Version',
          value: content.features.version,
          copy: false,
        },
        {
          label: 'Output Type',
          value: content.features.output_type,
          copy: false,
        },
        {
          label: 'Maturity',
          value: content.features.maturity,
          copy: false,
        },
        {
          label: 'Coinbase Extra Data',
          value: toHexString(content.features.coinbase_extra.data),
          copy: true,
        },
      ],
    },
    {
      label: 'Commitment',
      value: toHexString(content.commitment.data),
      copy: true,
    },
    {
      label: 'Hash',
      value: toHexString(content.hash.data),
      copy: true,
    },
    {
      label: 'Script',
      value: toHexString(content.script.data),
      copy: true,
    },
    {
      label: 'Sender Offset Public Key',
      value: toHexString(content.sender_offset_public_key.data),
      copy: true,
    },
    {
      label: 'Metadata Signature',
      copy: false,
      children: [
        {
          label: 'Ephemeral commitment',
          value: toHexString(
            content.metadata_signature.ephemeral_commitment.data
          ),
          copy: true,
        },
        {
          label: 'Ephemeral pubkey',
          value: toHexString(content.metadata_signature.ephemeral_pubkey.data),
          copy: true,
        },
        {
          label: 'u_a',
          value: toHexString(content.metadata_signature.u_a.data),
          copy: true,
        },
        {
          label: 'u_x',
          value: toHexString(content.metadata_signature.u_x.data),
          copy: true,
        },
        {
          label: 'u_y',
          value: toHexString(content.metadata_signature.u_y.data),
          copy: true,
        },
      ],
    },
    {
      label: 'Covenant Version',
      value: content.covenant.data,
      copy: false,
    },
    {
      label: 'Encrypted Data',
      value: toHexString(content.encrypted_data.data),
      copy: true,
    },
  ];

  return items;
};
