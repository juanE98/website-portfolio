'use client';

import { useState, useEffect } from 'react';
import { Position } from '@/types/fpl';
import { useFplPredictions } from '@/hooks/useFplPredictions';
import { useLatestGameweek } from '@/hooks/useLatestGameweek';
import GameweekSelector from './GameweekSelector';
import PositionFilter from './PositionFilter';
import PlayerTable from './PlayerTable';
import styles from './FplPredictions.module.scss';

export default function FplPredictions() {
  const [gameweek, setGameweek] = useState<number | null>(null);
  const [position, setPosition] = useState<Position>('ALL');
  const { latestGameweek } = useLatestGameweek();

  useEffect(() => {
    if (latestGameweek !== null && gameweek === null) {
      setGameweek(latestGameweek);
    }
  }, [latestGameweek, gameweek]);

  const { players, loading, error, refetch } = useFplPredictions(
    gameweek,
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
          <GameweekSelector gameweek={gameweek} onChange={setGameweek} />
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
