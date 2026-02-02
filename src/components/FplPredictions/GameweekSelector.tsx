'use client';

import styles from './FplPredictions.module.scss';

interface GameweekSelectorProps {
  gameweek: number | null;
  onChange: (gw: number) => void;
}

export default function GameweekSelector({
  gameweek,
  onChange,
}: GameweekSelectorProps) {
  const isLoading = gameweek === null;

  const handleDecrement = () => {
    if (gameweek !== null && gameweek > 1) {
      onChange(gameweek - 1);
    }
  };

  const handleIncrement = () => {
    if (gameweek !== null && gameweek < 38) {
      onChange(gameweek + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 38) {
      onChange(value);
    }
  };

  return (
    <div className={styles.gameweekSelector}>
      <label className={styles.label}>Gameweek</label>
      <div className={styles.gameweekControls}>
        <button
          className={styles.gameweekButton}
          onClick={handleDecrement}
          disabled={isLoading || (gameweek !== null && gameweek <= 1)}
          aria-label="Previous gameweek"
        >
          <i className="bi bi-dash"></i>
        </button>
        <input
          type="number"
          className={styles.gameweekInput}
          value={gameweek ?? ''}
          onChange={handleInputChange}
          min={1}
          max={38}
          aria-label="Gameweek number"
          disabled={isLoading}
        />
        <button
          className={styles.gameweekButton}
          onClick={handleIncrement}
          disabled={isLoading || (gameweek !== null && gameweek >= 38)}
          aria-label="Next gameweek"
        >
          <i className="bi bi-plus"></i>
        </button>
      </div>
    </div>
  );
}
