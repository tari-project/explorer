// API Response Types for Tari Blockchain Explorer

// === Core Data Structures ===

/**
 * Hex-encoded binary data structure used throughout the API
 * Can be either a hex string or an array of bytes
 */
export interface HexData {
  data: string | number[];
}

/**
 * Buffer data structure as received from Node.js Buffer serialization
 */
export interface BufferData {
  type: "Buffer";
  data: number[];
}

/**
 * API Error structure
 */
export interface ApiError {
  message: string;
  description: string;
  statusCode: string | number;
}

// === Block Structures ===

/**
 * Proof of Work algorithm data
 */
export interface ProofOfWork {
  pow_algo: number; // 0=RandomX(MM), 1=SHA3x, 2=RandomX
}

export interface KernelSearchItem {
  block_height: string;
  features: number;
  fee: string;
  lock_height: string;
  excess: HexData;
  excess_sig: {
    public_nonce: HexData;
    signature: HexData;
  };
  hash: HexData;
  version: number;
}

/**
 * Block header structure containing all block metadata
 */
export interface BlockHeader {
  hash: HexData;
  pow: ProofOfWork;
  height: number;
  version: number;
  timestamp: number;
  prev_hash: HexData;
  nonce: number;
  output_mr: HexData; // Output Merkle Root
  validator_node_mr: HexData; // Validator Node Merkle Root
  kernel_mr: HexData; // Kernel Merkle Root
  input_mr: HexData; // Input Merkle Root
  kernel_mmr_size: number;
  output_mmr_size: number;
  total_kernel_offset: HexData;
  total_script_offset: HexData;
}

/**
 * Block summary structure for list views
 */
export interface BlockData {
  height: string;
  timestamp: number;
  hash: HexData;
  kernels: number;
  outputs: number;
  pow?: ProofOfWork;
  prevLink?: string;
  nextLink?: string;
}

/**
 * Block body containing transactions
 */
export interface BlockBody {
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  kernels: TransactionKernel[];
}

/**
 * Complete block structure
 */
export interface Block {
  header: BlockHeader;
  body: BlockBody;
}

// === Transaction Structures ===

/**
 * Output features structure
 */
export interface OutputFeatures {
  version: number;
  output_type: number | string; // Can be either number or string based on API responses
  maturity: number;
  coinbase_extra?: HexData;
}

/**
 * Cryptographic signature structure
 */
export interface Signature {
  ephemeral_commitment: HexData;
  ephemeral_pubkey: HexData;
  u_a: HexData;
  u_x: HexData;
  u_y: HexData;
}

/**
 * Excess signature structure for kernels
 */
export interface ExcessSignature {
  public_nonce: HexData;
  signature: HexData;
}

/**
 * Transaction kernel structure
 */
export interface TransactionKernel {
  features: number;
  fee: number; // In microTari
  lock_height: number;
  excess: HexData;
  excess_sig: ExcessSignature;
  hash: HexData;
  version: number;
}

/**
 * Transaction output structure
 */
export interface TransactionOutput {
  payment_reference: HexData;
  features: OutputFeatures;
  commitment: HexData;
  hash: HexData;
  script: HexData;
  sender_offset_public_key: HexData;
  metadata_signature: Signature;
  covenant: HexData;
  encrypted_data: HexData;
}

/**
 * Transaction input structure
 */
export interface TransactionInput {
  features: OutputFeatures;
  commitment: HexData;
  hash: HexData;
  script: HexData;
  input_data: HexData;
  sender_offset_public_key: HexData;
  script_signature: Signature;
  output_hash: HexData;
  covenant: HexData;
  version: number;
  encrypted_data: HexData;
  minimum_value_promise: number;
  metadata_signature: Signature;
  rangeproof_hash: HexData;
}

/**
 * Transaction body structure
 */
export interface TransactionBody {
  signature: HexData;
  total_fees: number;
  outputs: TransactionOutput[];
  kernels: TransactionKernel[];
  inputs: TransactionInput[];
}

/**
 * Mempool transaction structure
 */
export interface MempoolTransaction {
  transaction: {
    body: TransactionBody;
  };
}

// === Validator Node Structures ===

/**
 * Validator node structure
 */
export interface ValidatorNode {
  public_key: HexData;
  shard_key: HexData;
  committee: string;
}

// === Chart and Statistics Structures ===

/**
 * Time series data point
 */
export interface TimeSeriesPoint {
  blockNumber: number;
  value: number;
}

/**
 * Block times chart data
 */
export interface BlockTimesData {
  type: "RandomX" | "Sha3" | "All";
  targetTime: number;
  series: number[]; // Time in minutes
}

/**
 * Hash rates chart data
 */
export interface HashRatesData {
  type: "RandomX" | "Sha3" | "TariRandomX";
  series: TimeSeriesPoint[];
}

/**
 * Proof of Work algorithm distribution
 */
export interface AlgoSplit {
  moneroRx10: number;
  moneroRx20: number;
  sha3x: number;
}

/**
 * Network statistics
 */
export interface NetworkStats {
  best_block_height: number;
  total_difficulty: number;
  network_hashrate: number;
  block_time_avg: number;
  transactions_per_block: number;
}

// === API Response Structures ===

/**
 * Main API response structure (/?json)
 */
export interface MainApiResponse {
  tipInfo: {
    metadata: {
      best_block_height: number;
    };
  };
  headers: BlockHeader[];
  mempool: MempoolTransaction[];
  activeVns: ValidatorNode[];
  // Chart data
  blockTimes: { series: number[] };
  moneroTimes: { series: number[] };
  shaTimes: { series: number[] };
  hashRates: { series: number[] };
  moneroHashRates: { series: number[] };
  shaHashRates: { series: number[] };
  // PoW algorithm split
  algosplit: AlgoSplit;
}

/**
 * Paginated blocks response
 */
export interface PaginatedBlocksResponse {
  headers: BlockHeader[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Block detail response
 */
export interface BlockDetailResponse extends Block {
  inputs_length?: number;
  outputs_length?: number;
  kernels_length?: number;
}

/**
 * Paginated block data response (inputs/outputs/kernels)
 */
export interface PaginatedBlockDataResponse {
  body: {
    data: TransactionInput[] | TransactionOutput[] | TransactionKernel[];
  };
}

// === Search Response Structures ===

/**
 * Kernel search result item (legacy - for search results)
 */
export interface KernelSearchResultItem {
  block_height: number;
  kernel_index: number;
  signature: HexData;
  nonce: HexData;
}

/**
 * Kernel search response
 */
export interface KernelSearchResponse {
  items: KernelSearchResultItem[];
}

/**
 * PayRef search result item
 */
export interface PayRefSearchItem {
  block_height: number;
  output_index: number;
  payment_reference: HexData;
}

/**
 * PayRef search response
 */
export interface PayRefSearchResponse {
  items: PayRefSearchItem[];
}

// === Query Hook Return Types ===

/**
 * Base query result structure
 */
export interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => void;
}

// === Utility Types ===

/**
 * PoW algorithm enumeration
 */
export enum PowAlgorithm {
  RANDOMX_MM = 0,
  SHA3X = 1,
  RANDOMX = 2,
}

/**
 * Output type enumeration
 */
export enum OutputType {
  STANDARD = 0,
  COINBASE = 1,
  BURN = 2,
}

/**
 * Search type enumeration
 */
export enum SearchType {
  BLOCK_HEIGHT = "height",
  BLOCK_HASH = "hash",
  KERNEL_SIGNATURE = "kernel",
  PAYMENT_REFERENCE = "payref",
}

/**
 * Block data type for pagination
 */
export type BlockDataType = "inputs" | "outputs" | "kernels";
