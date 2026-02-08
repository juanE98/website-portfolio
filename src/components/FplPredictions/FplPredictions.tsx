'use client';

import { useState } from 'react';
import { Position } from '@/types/fpl';
import { useFplPredictions } from '@/hooks/useFplPredictions';
import { useLatestGameweek } from '@/hooks/useLatestGameweek';
import PositionFilter from './PositionFilter';
import PlayerTable from './PlayerTable';
import styles from './FplPredictions.module.scss';

export default function FplPredictions() {
  const [position, setPosition] = useState<Position>('ALL');
  const { latestGameweek } = useLatestGameweek();

  const { players, loading, error, refetch } = useFplPredictions(
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
          <span className={styles.gameweekLabel}>
            {latestGameweek !== null ? `Upcoming gameweek: ${latestGameweek}` : ''}
          </span>
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
