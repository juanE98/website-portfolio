'use client';

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { useFplPredictions } from '@/hooks/useFplPredictions';

const mockPlayers = [
  { player_id: 1, player_name: 'Erling Haaland', team: 'MCI', position: 'FWD', predicted_points: 8.5, haul_probability: 42, chance_of_playing: 100, gameweek: 1 },
  { player_id: 2, player_name: 'Mohamed Salah', team: 'LIV', position: 'MID', predicted_points: 7.8, haul_probability: 38, chance_of_playing: 100, gameweek: 1 },
  { player_id: 3, player_name: 'Cole Palmer', team: 'CHE', position: 'MID', predicted_points: 7.2, haul_probability: 35, chance_of_playing: 100, gameweek: 1 },
  { player_id: 4, player_name: 'Trent Alexander-Arnold', team: 'LIV', position: 'DEF', predicted_points: 6.2, haul_probability: 28, chance_of_playing: 100, gameweek: 1 },
  { player_id: 5, player_name: 'David Raya', team: 'ARS', position: 'GKP', predicted_points: 5.5, haul_probability: 18, chance_of_playing: 100, gameweek: 1 },
];

const createMockResponse = (players = mockPlayers) => ({
  gameweek: 1,
  position: null,
  limit: 10,
  sort_by: 'haul',
  available_only: true,
  count: players.length,
  predictions: players,
});

// Wrapper to isolate SWR cache between tests
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
);

describe('useFplPredictions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useFplPredictions(1, 'ALL'), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.players).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should return players after loading', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse()),
    });

    const { result } = renderHook(() => useFplPredictions(1, 'ALL'), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('should return empty array when API returns empty predictions', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse([])),
    });

    const { result } = renderHook(() => useFplPredictions(25, 'ALL'), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should filter players by position via API', async () => {
    const fwdPlayers = mockPlayers.filter(p => p.position === 'FWD');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(fwdPlayers)),
    });

    const { result } = renderHook(() => useFplPredictions(1, 'FWD'), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players.length).toBeGreaterThan(0);
    result.current.players.forEach((player) => {
      expect(player.position).toBe('FWD');
    });

    // Verify position param was passed to API
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('position=FWD')
    );
  });

  it('should filter players by GKP position', async () => {
    const gkpPlayers = mockPlayers.filter(p => p.position === 'GKP');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(gkpPlayers)),
    });

    const { result } = renderHook(() => useFplPredictions(1, 'GKP'), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players.length).toBeGreaterThan(0);
    result.current.players.forEach((player) => {
      expect(player.position).toBe('GKP');
    });
  });

  it('should filter players by DEF position', async () => {
    const defPlayers = mockPlayers.filter(p => p.position === 'DEF');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(defPlayers)),
    });

    const { result } = renderHook(() => useFplPredictions(1, 'DEF'), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players.length).toBeGreaterThan(0);
    result.current.players.forEach((player) => {
      expect(player.position).toBe('DEF');
    });
  });

  it('should filter players by MID position', async () => {
    const midPlayers = mockPlayers.filter(p => p.position === 'MID');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(midPlayers)),
    });

    const { result } = renderHook(() => useFplPredictions(1, 'MID'), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.players.length).toBeGreaterThan(0);
    result.current.players.forEach((player) => {
      expect(player.position).toBe('MID');
    });
  });

  it('should not include position param when filter is ALL', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse()),
    });

    const { result } = renderHook(() => useFplPredictions(1, 'ALL'), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const positions = new Set(result.current.players.map((p) => p.position));
    expect(positions.size).toBeGreaterThan(1);

    // Verify position param was NOT passed to API
    expect(global.fetch).toHaveBeenCalledWith(
      expect.not.stringContaining('position=')
    );
  });

  it('should have correct player data structure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse()),
    });

    const { result } = renderHook(() => useFplPredictions(1, 'ALL'), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const player = result.current.players[0];
    expect(player).toHaveProperty('player_id');
    expect(player).toHaveProperty('player_name');
    expect(player).toHaveProperty('team');
    expect(player).toHaveProperty('position');
    expect(player).toHaveProperty('predicted_points');
    expect(player).toHaveProperty('haul_probability');
    expect(player).toHaveProperty('chance_of_playing');
    expect(player).toHaveProperty('gameweek');
  });

  it('should pass gameweek to API', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse()),
    });

    renderHook(() => useFplPredictions(5, 'ALL'), { wrapper });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('gameweek=5')
      );
    });
  });

  it('should provide refetch function', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse()),
    });

    const { result } = renderHook(() => useFplPredictions(1, 'ALL'), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');
  });

  it('should refetch data when refetch is called', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse()),
    });

    const { result } = renderHook(() => useFplPredictions(1, 'ALL'), { wrapper });

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

  it('should handle API errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useFplPredictions(1, 'ALL'), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBe('API error: 500');
    });

    expect(result.current.players).toEqual([]);
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFplPredictions(1, 'ALL'), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });

    expect(result.current.players).toEqual([]);
  });

  it('should call fetch without headers (CORS-based auth)', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse()),
    });

    renderHook(() => useFplPredictions(1, 'ALL'), { wrapper });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String));
    });
  });
});
