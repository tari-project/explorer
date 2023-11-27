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

// declare module 'baseNodeClient' {
//   export const createClient: any;
// }

// import { Metadata, credentials, ServiceClientConstructor } from '@grpc/grpc-js';
// import { ClientWritableStream, ClientReadableStream } from 'grpc';

// declare module '@tari/base-node-grpc-client' {
//   export namespace types {
//     export import tariGrpc = protoDescriptor.tari.rpc;
//   }

//   interface ClientConstructor extends ServiceClientConstructor {
//     new (
//       address: string,
//       credentials: credentials.ChannelCredentials,
//       options?: object
//     ): Client;
//   }

//   interface Client {
//     inner: any; // Replace with the actual inner type if you know it

//     getVersion(
//       request: types.tariGrpc.GetVersionRequest,
//       metadata?: Metadata
//     ): Promise<types.tariGrpc.GetVersionResponse>;
//     listHeaders(
//       request: types.tariGrpc.ListHeadersRequest,
//       metadata?: Metadata
//     ): ClientReadableStream<types.tariGrpc.BlockHeader>;
//     getBlocks(
//       request: types.tariGrpc.GetBlocksRequest,
//       metadata?: Metadata
//     ): ClientReadableStream<types.tariGrpc.Block>;
//     getMempoolTransactions(
//       request: types.tariGrpc.GetMempoolTransactionsRequest,
//       metadata?: Metadata
//     ): ClientReadableStream<types.tariGrpc.MempoolTransaction>;
//     getTipInfo(
//       request: types.tariGrpc.GetTipInfoRequest,
//       metadata?: Metadata
//     ): Promise<types.tariGrpc.TipInfo>;
//     searchUtxos(
//       request: types.tariGrpc.SearchUtxosRequest,
//       metadata?: Metadata
//     ): ClientReadableStream<types.tariGrpc.Utxo>;
//     getTokens(
//       request: types.tariGrpc.GetTokensRequest,
//       metadata?: Metadata
//     ): Promise<types.tariGrpc.GetTokensResponse>;
//     getNetworkDifficulty(
//       request: types.tariGrpc.GetNetworkDifficultyRequest,
//       metadata?: Metadata
//     ): Promise<types.tariGrpc.GetNetworkDifficultyResponse>;
//     getActiveValidatorNodes(
//       request: types.tariGrpc.GetActiveValidatorNodesRequest,
//       metadata?: Metadata
//     ): ClientReadableStream<types.tariGrpc.ValidatorNodeInfo>;

//     // Add more methods as needed

//     // In case you need to add custom methods:
//     [key: string]:
//       | ((arg: any, metadata?: Metadata) => any)
//       | ClientWritableStream<any>;
//   }

//   export const Client: ClientConstructor;

//   export const types: {
//     tariGrpc: protoDescriptor.tari.rpc;
//   };
// }
