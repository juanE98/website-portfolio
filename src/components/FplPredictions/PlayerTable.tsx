'use client';

import { FplPlayer } from '@/types/fpl';
import styles from './FplPredictions.module.scss';

interface PlayerTableProps {
  players: FplPlayer[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function PlayerTable({
  players,
  loading,
  error,
  onRetry,
}: PlayerTableProps) {
  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.playerTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Pos</th>
              <th>Pts</th>
              <th>Haul %</th>
              <th>Avail</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className={styles.skeletonRow}>
                <td><div className={styles.skeleton}></div></td>
                <td><div className={styles.skeleton}></div></td>
                <td><div className={styles.skeleton}></div></td>
                <td><div className={styles.skeleton}></div></td>
                <td><div className={styles.skeleton}></div></td>
                <td><div className={styles.skeleton}></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <i className="bi bi-exclamation-triangle"></i>
        <p>{error}</p>
        <button className={styles.retryButton} onClick={onRetry}>
          <i className="bi bi-arrow-clockwise"></i> Retry
        </button>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className={styles.emptyState}>
        <i className="bi bi-inbox"></i>
        <p>No players found</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.playerTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Pos</th>
            <th>Pts</th>
            <th>Haul %</th>
            <th>Avail</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={`${player.player_name}-${index}`}>
              <td>{index + 1}</td>
              <td className={styles.playerName}>{player.player_name}</td>
              <td>{player.position}</td>
              <td>{player.predicted_points.toFixed(1)}</td>
              <td>{(player.haul_probability * 100).toFixed(0)}%</td>
              <td>{player.chance_of_playing}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
