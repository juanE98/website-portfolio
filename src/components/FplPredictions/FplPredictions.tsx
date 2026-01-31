'use client';

import { useState } from 'react';
import { Position } from '@/types/fpl';
import { useFplPredictions } from '@/hooks/useFplPredictions';
import GameweekSelector from './GameweekSelector';
import PositionFilter from './PositionFilter';
import PlayerTable from './PlayerTable';
import styles from './FplPredictions.module.scss';

export default function FplPredictions() {
  const [gameweek, setGameweek] = useState(1);
  const [position, setPosition] = useState<Position>('ALL');

  const { players, loading, error, refetch } = useFplPredictions(
    gameweek,
    position
  );

  return (
    <section className={styles.fplPredictions}>
      <div className={styles.container}>
        <h2>FPL Predictions</h2>
        <p className={styles.subtitle}>
          Top predicted players powered by auto-haaland
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
