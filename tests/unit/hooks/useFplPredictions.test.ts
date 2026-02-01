'use client';

import { renderHook, waitFor, act } from '@testing-library/react';
import { useFplPredictions } from '@/hooks/useFplPredictions';

describe('useFplPredictions', () => {
  it('should return loading state initially', () => {
    const { result } = renderHook(() => useFplPredictions(1, 'ALL'));

    expect(result.current.loading).toBe(true);
    expect(result.current.players).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should return players after loading', async () => {
    const { result } = renderHook(() => useFplPredictions(1, 'ALL'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('should return empty array for gameweek 25', async () => {
    const { result } = renderHook(() => useFplPredictions(25, 'ALL'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should filter players by position', async () => {
    const { result } = renderHook(() => useFplPredictions(1, 'FWD'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players.length).toBeGreaterThan(0);
    result.current.players.forEach((player) => {
      expect(player.position).toBe('FWD');
    });
  });

  it('should filter players by GKP position', async () => {
    const { result } = renderHook(() => useFplPredictions(1, 'GKP'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players.length).toBeGreaterThan(0);
    result.current.players.forEach((player) => {
      expect(player.position).toBe('GKP');
    });
  });

  it('should filter players by DEF position', async () => {
    const { result } = renderHook(() => useFplPredictions(1, 'DEF'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players.length).toBeGreaterThan(0);
    result.current.players.forEach((player) => {
      expect(player.position).toBe('DEF');
    });
  });

  it('should filter players by MID position', async () => {
    const { result } = renderHook(() => useFplPredictions(1, 'MID'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players.length).toBeGreaterThan(0);
    result.current.players.forEach((player) => {
      expect(player.position).toBe('MID');
    });
  });

  it('should return all positions when filter is ALL', async () => {
    const { result } = renderHook(() => useFplPredictions(1, 'ALL'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const positions = new Set(result.current.players.map((p) => p.position));
    expect(positions.size).toBeGreaterThan(1);
  });

  it('should have correct player data structure', async () => {
    const { result } = renderHook(() => useFplPredictions(1, 'ALL'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const player = result.current.players[0];
    expect(player).toHaveProperty('player_name');
    expect(player).toHaveProperty('position');
    expect(player).toHaveProperty('predicted_points');
    expect(player).toHaveProperty('haul_probability');
    expect(player).toHaveProperty('chance_of_playing');
  });

  it('should adjust predicted points based on gameweek', async () => {
    const { result: result1 } = renderHook(() => useFplPredictions(1, 'ALL'));
    const { result: result2 } = renderHook(() => useFplPredictions(2, 'ALL'));

    await waitFor(() => {
      expect(result1.current.loading).toBe(false);
    });

    await waitFor(() => {
      expect(result2.current.loading).toBe(false);
    });

    // Points should differ slightly between gameweeks
    const points1 = result1.current.players[0]?.predicted_points;
    const points2 = result2.current.players[0]?.predicted_points;
    expect(points1).not.toBe(points2);
  });

  it('should provide refetch function', async () => {
    const { result } = renderHook(() => useFplPredictions(1, 'ALL'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');
  });

  it('should refetch data when refetch is called', async () => {
    const { result } = renderHook(() => useFplPredictions(1, 'ALL'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialPlayersLength = result.current.players.length;

    // Call refetch wrapped in act
    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have players again
    expect(result.current.players.length).toBe(initialPlayersLength);
  });
});
