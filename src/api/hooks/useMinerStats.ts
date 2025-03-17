import { useQuery } from '@tanstack/react-query';

export const MINER_STATS_QUERY_KEY = ['minerStats'];

interface MinerStats {
    totalMiners: number;
}

async function fetchMinerStats(): Promise<MinerStats> {
    const response = await fetch('https://rwa.y.at/miner/stats');

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
