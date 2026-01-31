'use client';

import { Position } from '@/types/fpl';
import styles from './FplPredictions.module.scss';

interface PositionFilterProps {
  position: Position;
  onChange: (pos: Position) => void;
}

const positions: Position[] = ['ALL', 'GKP', 'DEF', 'MID', 'FWD'];

export default function PositionFilter({
  position,
  onChange,
}: PositionFilterProps) {
  return (
    <div className={styles.positionFilter}>
      <label className={styles.label}>Position</label>
      <div className={styles.positionButtons}>
        {positions.map((pos) => (
          <button
            key={pos}
            className={`${styles.positionButton} ${
              position === pos ? styles.active : ''
            }`}
            onClick={() => onChange(pos)}
            aria-pressed={position === pos}
          >
            {pos === 'ALL' ? 'All' : pos}
          </button>
        ))}
      </div>
    </div>
  );
}
