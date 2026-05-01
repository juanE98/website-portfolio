'use client';

import { useEffect, useState } from 'react';
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

interface RevealProps {
  delay?: number;
  shown: boolean;
  children: React.ReactNode;
}

function Reveal({ delay = 0, shown, children }: RevealProps) {
  return (
    <div
      className={`${styles.reveal} ${shown ? styles.shown : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function FplPredictions() {
  const [position, setPosition] = useState<Position>('ALL');
  const [shown, setShown] = useState(false);
  const { latestGameweek } = useLatestGameweek();
  const season = getCurrentSeason();

  const { players, gameweek, loading, error, refetch } = useFplPredictions(
    latestGameweek,
    position
  );

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 30);
    return () => clearTimeout(t);
  }, []);

  const displayedGw = gameweek ?? latestGameweek;
  const gwForCommand = displayedGw != null ? displayedGw.toString() : 'next';
  const rowCount = players.length;

  return (
    <section className={styles.fplPredictions}>
      <div className={styles.container}>
        <Reveal shown={shown}>
          <div className={styles.commandLine}>
            <span className={styles.prompt}>$</span> ./predict --season {season}{' '}
            --gw {gwForCommand} --pos {position.toLowerCase()}
          </div>
        </Reveal>

        <Reveal shown={shown} delay={80}>
          <div className={styles.titleRow}>
            <span className={styles.titlePrefix}>01.</span>
            <h2 className={styles.titleHeading}>FPL Predictions</h2>
            <span className={styles.titleHairline} aria-hidden="true" />
            <span className={styles.titleKicker}>POWERED BY AUTO-HAALAND</span>
          </div>
        </Reveal>

        <Reveal shown={shown} delay={140}>
          <p className={styles.subtitle}>
            Top predicted players for the upcoming round, scored by{' '}
            <a
              href="https://github.com/juanE98/auto-haaland"
              target="_blank"
              rel="noopener noreferrer"
            >
              auto-haaland
            </a>
            . A Python pipeline that runs automatically before each gameweek.
            It ingests fixtures, form, and xG data to rank players by expected
            points.
          </p>
        </Reveal>

        <Reveal shown={shown} delay={200}>
          <div className={styles.controls}>
            <div className={styles.chipGroup}>
              <span className={styles.chipLabel}>SEASON</span>
              <span className={styles.chip}>{season}</span>
            </div>
            <div className={styles.chipGroup}>
              <span className={styles.chipLabel}>Gameweek</span>
              <span className={styles.chip}>
                {displayedGw != null ? displayedGw : '—'}
              </span>
            </div>
            <PositionFilter position={position} onChange={setPosition} />
            <div className={styles.spacer} />
            <div className={styles.rowsCount}>
              <span className={styles.liveDot}>●</span> {rowCount} ROWS
            </div>
          </div>
        </Reveal>

        <Reveal shown={shown} delay={260}>
          <PlayerTable
            players={players}
            loading={loading}
            error={error}
            onRetry={refetch}
            gameweek={displayedGw}
          />
        </Reveal>

        <Reveal shown={shown} delay={320}>
          <div className={styles.disclaimer}>
            <span className={styles.hash}>#</span> Disclaimer: model output for
            entertainment. Not financial advice for your wildcard.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
