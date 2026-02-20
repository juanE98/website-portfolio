'use client';

import { useState } from 'react';
import { Position } from '@/types/fpl';
import { useFplPredictions } from '@/hooks/useFplPredictions';
import { useLatestGameweek } from '@/hooks/useLatestGameweek';
import PositionFilter from './PositionFilter';
import PlayerTable from './PlayerTable';
import styles from './FplPredictions.module.scss';

function getCurrentSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startYear = month >= 7 ? year : year - 1; // FPL season starts in August
  return `${startYear}/${(startYear + 1).toString().slice(-2)}`;
}

export default function FplPredictions() {
  const [position, setPosition] = useState<Position>('ALL');
  const { latestGameweek } = useLatestGameweek();
  const season = getCurrentSeason();

  const { players, gameweek, loading, error, refetch } = useFplPredictions(
    latestGameweek,
    position
  );

  return (
    <section className={styles.fplPredictions}>
      <div className={styles.container}>
        <h2>FPL Predictions</h2>
        <p className={styles.subtitle}>
          Top predicted players powered by{' '}
          <a
            href="https://github.com/juanE98/auto-haaland"
            target="_blank"
            rel="noopener noreferrer"
          >
            auto-haaland
          </a>
        </p>

        <div className={styles.controls}>
          <div className={styles.gameweekDisplay}>
            <label className={styles.label}>Season</label>
            <span className={styles.gameweekNumber}>{season}</span>
          </div>
          <div className={styles.gameweekDisplay}>
            <label className={styles.label}>Gameweek</label>
            <span className={styles.gameweekNumber}>
              {gameweek ?? latestGameweek ?? '—'}
            </span>
          </div>
          <PositionFilter position={position} onChange={setPosition} />
        </div>

        <PlayerTable
          players={players}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </div>
    </section>
  );
}
