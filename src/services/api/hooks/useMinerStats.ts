import { useQuery } from '@tanstack/react-query';

export const MINER_STATS_QUERY_KEY = ['minerStats'];

interface MinerStats {
    totalMiners: number;
    total_nodes: number;
    confirmed_nodes: number;
    confirmed_nodes_24h: number;
    unconfirmed_nodes: number;
    p2p_discovered: number;
    registry_discovered: number;
    both_discovered: number;
    onion_capable: number;
    clearnet_capable: number;
    clearnet_only: number;
    network_height: number;
    network_height_node_count: number;
}

async function fetchMinerStats(): Promise<MinerStats> {
    const response = await fetch('https://netmap.supportxtm.com/api/v1/stats');

    if (!response.ok) {
        throw new Error('Failed to fetch miner stats');
    }

    return response.json();
}

export function useMinerStats() {
    return useQuery<MinerStats>({
        queryKey: MINER_STATS_QUERY_KEY,
        queryFn: fetchMinerStats,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    });
}
