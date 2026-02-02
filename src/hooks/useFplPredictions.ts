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
    limit: '10',
    sort_by: 'haul',
    available_only: 'true',
  });

  if (position !== 'ALL') {
    params.append('position', position);
  }

  return `${FPL_API_URL}/top?${params.toString()}`;
}

export function useFplPredictions(
  gameweek: number,
  position: Position
): UseFplPredictionsResult {
  const url = buildUrl(gameweek, position);

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    players: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch: () => mutate(),
  };
}
