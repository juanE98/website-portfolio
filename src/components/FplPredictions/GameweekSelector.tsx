'use client';

import styles from './FplPredictions.module.scss';

interface GameweekSelectorProps {
  gameweek: number | null;
  latestGameweek: number | null;
  onChange: (gw: number) => void;
}

export default function GameweekSelector({
  gameweek,
  latestGameweek,
  onChange,
}: GameweekSelectorProps) {
  const isLoading = gameweek === null || latestGameweek === null;
  const minGameweek = latestGameweek !== null ? Math.max(1, latestGameweek - 4) : 1;
  const maxGameweek = latestGameweek ?? 38;

  const handleDecrement = () => {
    if (gameweek !== null && gameweek > minGameweek) {
      onChange(gameweek - 1);
    }
  };

  const handleIncrement = () => {
    if (gameweek !== null && gameweek < maxGameweek) {
      onChange(gameweek + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= minGameweek && value <= maxGameweek) {
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
          disabled={isLoading || (gameweek !== null && gameweek <= minGameweek)}
          aria-label="Previous gameweek"
        >
          <i className="bi bi-dash"></i>
        </button>
        <input
          type="number"
          className={styles.gameweekInput}
          value={gameweek ?? ''}
          onChange={handleInputChange}
          min={minGameweek}
          max={maxGameweek}
          aria-label="Gameweek number"
          disabled={isLoading}
        />
        <button
          className={styles.gameweekButton}
          onClick={handleIncrement}
          disabled={isLoading || (gameweek !== null && gameweek >= maxGameweek)}
          aria-label="Next gameweek"
        >
          <i className="bi bi-plus"></i>
        </button>
      </div>
    </div>
  );
}
