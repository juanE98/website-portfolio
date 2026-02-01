'use client';

import { useState, useEffect, useCallback } from 'react';
import { FplPlayer, Position } from '@/types/fpl';

interface UseFplPredictionsResult {
  players: FplPlayer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Mock data for frontend development
const mockPlayers: FplPlayer[] = [
  { player_name: 'Erling Haaland', position: 'FWD', predicted_points: 8.5, haul_probability: 0.42, chance_of_playing: 100 },
  { player_name: 'Mohamed Salah', position: 'MID', predicted_points: 7.8, haul_probability: 0.38, chance_of_playing: 100 },
  { player_name: 'Cole Palmer', position: 'MID', predicted_points: 7.2, haul_probability: 0.35, chance_of_playing: 100 },
  { player_name: 'Bukayo Saka', position: 'MID', predicted_points: 6.9, haul_probability: 0.32, chance_of_playing: 100 },
  { player_name: 'Alexander Isak', position: 'FWD', predicted_points: 6.7, haul_probability: 0.30, chance_of_playing: 100 },
  { player_name: 'Trent Alexander-Arnold', position: 'DEF', predicted_points: 6.2, haul_probability: 0.28, chance_of_playing: 100 },
  { player_name: 'William Saliba', position: 'DEF', predicted_points: 5.8, haul_probability: 0.22, chance_of_playing: 100 },
  { player_name: 'David Raya', position: 'GKP', predicted_points: 5.5, haul_probability: 0.18, chance_of_playing: 100 },
  { player_name: 'Gabriel Magalhães', position: 'DEF', predicted_points: 5.3, haul_probability: 0.20, chance_of_playing: 100 },
  { player_name: 'Jordan Pickford', position: 'GKP', predicted_points: 4.8, haul_probability: 0.15, chance_of_playing: 100 },
];

export function useFplPredictions(
  gameweek: number,
  position: Position
): UseFplPredictionsResult {
  const [players, setPlayers] = useState<FplPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Return empty data for gameweek 25 to test empty state
      if (gameweek === 25) {
        setPlayers([]);
        setLoading(false);
        return;
      }

      // Filter by position if not ALL
      let filteredPlayers = mockPlayers;
      if (position !== 'ALL') {
        filteredPlayers = mockPlayers.filter((p) => p.position === position);
      }

      // Simulate slight variation based on gameweek
      const adjustedPlayers = filteredPlayers.map((p) => ({
        ...p,
        predicted_points: +(p.predicted_points + (gameweek % 3) * 0.1).toFixed(1),
      }));

      setPlayers(adjustedPlayers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [gameweek, position]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  return { players, loading, error, refetch: fetchPredictions };
}
