export interface FplPlayer {
  player_name: string;
  position: string;
  predicted_points: number;
  haul_probability: number;
  chance_of_playing: number;
}

export interface FplPredictionsResponse {
  players: FplPlayer[];
}

export type Position = 'ALL' | 'GKP' | 'DEF' | 'MID' | 'FWD';
