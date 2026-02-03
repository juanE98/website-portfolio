'use client';

import useSWR from 'swr';
import { FPL_API_URL } from '@/config/api';

interface LatestGameweekResponse {
  gameweek: number;
}

async function fetcher(url: string): Promise<number> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: LatestGameweekResponse = await response.json();
  return data.gameweek;
}

const FALLBACK_GAMEWEEK = 1;

export function useLatestGameweek() {
  const { data, error, isLoading } = useSWR(
    `${FPL_API_URL}/gameweek/latest`,
    fetcher,
    {
      dedupingInterval: 60 * 60 * 1000, // 1 hour - gameweek rarely changes
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

  // Use fallback if API fails or returns no data
  const latestGameweek = data ?? (error ? FALLBACK_GAMEWEEK : null);

  return {
    latestGameweek,
    loading: isLoading && !error,
    error: error?.message ?? null,
  };
}
