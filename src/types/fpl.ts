export interface FplPlayer {
  player_id: number;
  player_name: string;
  team: string;
  position: string;
  predicted_points: number;
  haul_probability: number;
  chance_of_playing: number;
  gameweek: number;
}

export interface FplApiResponse {
  gameweek: number;
  position: string | null;
  limit: number;
  sort_by: string;
  available_only: boolean;
  count: number;
  predictions: FplPlayer[];
}

export type Position = 'ALL' | 'GKP' | 'DEF' | 'MID' | 'FWD';
