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

export function useLatestGameweek() {
  const { data, error, isLoading } = useSWR(
    `${FPL_API_URL}/gameweek/latest`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    latestGameweek: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
}
