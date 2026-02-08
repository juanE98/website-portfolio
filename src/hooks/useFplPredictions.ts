'use client';

import useSWR from 'swr';
import { FplPlayer, FplApiResponse, Position } from '@/types/fpl';
import { FPL_API_URL } from '@/config/api';

interface UseFplPredictionsResult {
  players: FplPlayer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

async function fetcher(url: string): Promise<FplPlayer[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: FplApiResponse = await response.json();
  return data.predictions;
}

function buildUrl(gameweek: number, position: Position): string {
  const params = new URLSearchParams({
    gameweek: gameweek.toString(),
    limit: '15',
    sort_by: 'haul',
    available_only: 'true',
  });

  if (position !== 'ALL') {
    params.append('position', position);
  }

  return `${FPL_API_URL}/top?${params.toString()}`;
}

export function useFplPredictions(
  gameweek: number | null,
  position: Position
): UseFplPredictionsResult {
  const url = gameweek !== null ? buildUrl(gameweek, position) : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    dedupingInterval: 5 * 60 * 1000, // 5 minutes - predictions don't change often
    revalidateIfStale: false, // Don't auto-revalidate stale data
  });

  return {
    players: data ?? [],
    loading: gameweek === null || isLoading,
    error: error?.message ?? null,
    refetch: () => mutate(),
  };
}
