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

import { useQuery } from '@tanstack/react-query';
import { apiError } from '../helpers/types';
import { jsonRpc } from '../helpers/jsonRpc';

const address = import.meta.env.VITE_ADDRESS;

export const useAllBlocks = () => {
  return useQuery({
    queryKey: ['blocks'],
    queryFn: () =>
      jsonRpc(`${address}/?json`).then((resp) => {
        return resp;
      }),
    onError: (error: apiError) => {
      error;
    },
    refetchInterval: 120000,
  });
};

export const useGetBlocksByParam = (from: number, limit: number) => {
  return useQuery({
    queryKey: ['blocks', from, limit],
    queryFn: () =>
      jsonRpc(`${address}/?from=${from}&limit=${limit}&json`).then((resp) => {
        return resp;
      }),
    onError: (error: apiError) => {
      error;
    },
  });
};

export const useGetBlockByHeightOrHash = (blockHeight: string) => {
  return useQuery({
    queryKey: ['block', blockHeight],
    queryFn: () =>
      jsonRpc(`${address}/blocks/${blockHeight}?json`, 'Block not found').then(
        (resp) => {
          return resp;
        }
      ),
    onError: (error: apiError) => {
      return error;
    },
  });
};

export const useGetPaginatedData = (
  blockHeight: string,
  what: string,
  from: number,
  to: number
) => {
  return useQuery({
    queryKey: ['block', blockHeight, what, from, to],
    queryFn: () =>
      jsonRpc(
        `${address}/block_data/${blockHeight}?what=${what}&from=${from.toString()}&to=${to.toString()}&json`,
        'Block not found'
      ).then((resp) => {
        return resp;
      }),
    onError: (error: apiError) => {
      return error;
    },
  });
};

export const useSearchByKernel = (nonces: string[], signatures: string[]) => {
  return useQuery({
    queryKey: ['searchByKernel'],
    queryFn: () => {
      const encodedNonces = nonces.map(encodeURIComponent).join(',');
      const encodedSignatures = signatures.map(encodeURIComponent).join(',');

      return jsonRpc(
        `${address}/search_kernels?nonces=${encodedNonces}&signatures=${encodedSignatures}&json`
      ).then((resp) => {
        return resp;
      });
    },
    onError: (error: apiError) => {
      error;
    },
  });
};
