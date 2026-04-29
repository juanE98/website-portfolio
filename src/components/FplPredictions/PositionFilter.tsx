'use client';

import { Position } from '@/types/fpl';
import styles from './FplPredictions.module.scss';

interface PositionFilterProps {
  position: Position;
  onChange: (pos: Position) => void;
}

const POSITIONS: Position[] = ['ALL', 'GKP', 'DEF', 'MID', 'FWD'];

const positionLabel = (p: Position): string => (p === 'ALL' ? 'All' : p);

export default function PositionFilter({
  position,
  onChange,
}: PositionFilterProps) {
  return (
    <div className={styles.positionFilter}>
      <span className={styles.chipLabel}>POSITION</span>
      <div className={styles.positionButtons}>
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            type="button"
            className={`${styles.positionButton} ${
              position === pos ? styles.active : ''
            }`}
            onClick={() => onChange(pos)}
            aria-pressed={position === pos}
          >
            {positionLabel(pos)}
          </button>
        ))}
      </div>
    </div>
  );
}
