'use client';

import { useMemo, useState } from 'react';
import { FplPlayer } from '@/types/fpl';
import styles from './FplPredictions.module.scss';

interface PlayerTableProps {
  players: FplPlayer[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  gameweek?: number | null;
}

type SortKey = 'name' | 'pos' | 'pts' | 'haul' | 'avail';
type SortDir = 'asc' | 'desc';

const TERMINAL_CMD =
  'psql -d fpl -c "SELECT * FROM predictions ORDER BY pts DESC LIMIT 15;"';

function getPosClass(pos: string): string {
  switch (pos) {
    case 'GKP':
      return styles.posGKP;
    case 'DEF':
      return styles.posDEF;
    case 'MID':
      return styles.posMID;
    case 'FWD':
      return styles.posFWD;
    default:
      return styles.posDefault;
  }
}

interface AvailMeta {
  label: string;
  color: string;
}

function getAvailMeta(chance: number): AvailMeta {
  if (chance >= 100) return { label: 'OK', color: '#86efac' };
  if (chance <= 0) return { label: 'OUT', color: '#ef4444' };
  if (chance >= 50) return { label: `${chance}%`, color: '#f59e0b' };
  return { label: `${chance}%`, color: '#ef4444' };
}

function HaulBar({ pct }: { pct: number }) {
  const safePct = Math.max(0, Math.min(100, pct));
  const color = safePct >= 65 ? '#f59e0b' : '#22d3ee';
  return (
    <span className={styles.haulBar}>
      <span className={styles.haulPct}>{Math.round(safePct)}%</span>
      <span className={styles.haulTrack}>
        <span
          className={styles.haulFill}
          style={{
            width: `${safePct}%`,
            background: color,
            boxShadow: `0 0 6px ${color}88`,
          }}
        />
      </span>
    </span>
  );
}

interface SortableHeaderProps {
  label: string;
  sortKey?: SortKey;
  align?: 'left' | 'right';
  activeKey: SortKey | null;
  dir: SortDir;
  onSort?: (key: SortKey) => void;
}

function HeaderCell({
  label,
  sortKey,
  align = 'left',
  activeKey,
  dir,
  onSort,
}: SortableHeaderProps) {
  const isActive = sortKey != null && sortKey === activeKey;
  const sortable = !!sortKey && !!onSort;

  const classes = [
    align === 'right' ? styles.thRight : '',
    sortable ? styles.thSortable : '',
    isActive ? styles.thActive : '',
    isActive && dir === 'asc' ? styles.thAsc : '',
    isActive && dir === 'desc' ? styles.thDesc : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <th
      className={classes}
      onClick={sortable ? () => onSort!(sortKey!) : undefined}
      aria-sort={
        isActive ? (dir === 'asc' ? 'ascending' : 'descending') : undefined
      }
    >
      {label}
    </th>
  );
}

export default function PlayerTable({
  players,
  loading,
  error,
  onRetry,
}: PlayerTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('haul');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sortedPlayers = useMemo(() => {
    const rows = [...players];
    rows.sort((a, b) => {
      let va: string | number;
      let vb: string | number;
      switch (sortKey) {
        case 'name':
          va = a.player_name;
          vb = b.player_name;
          break;
        case 'pos':
          va = a.position;
          vb = b.position;
          break;
        case 'pts':
          va = a.predicted_points;
          vb = b.predicted_points;
          break;
        case 'haul':
          va = a.haul_probability;
          vb = b.haul_probability;
          break;
        case 'avail':
          va = a.chance_of_playing;
          vb = b.chance_of_playing;
          break;
      }
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      const sa = String(va);
      const sb = String(vb);
      return sortDir === 'asc'
        ? sa.localeCompare(sb)
        : sb.localeCompare(sa);
    });
    return rows;
  }, [players, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  // Render the terminal panel with title bar + table + status bar.
  const renderTerminalShell = (
    body: React.ReactNode,
    statusRight?: React.ReactNode
  ) => (
    <div className={styles.terminalPanel}>
      <div className={styles.terminalTitleBar}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotAmber}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
        <span className={styles.terminalCaption}>{TERMINAL_CMD}</span>
      </div>
      {body}
      <div className={styles.statusBar}>
        <span>
          <span className={styles.live}>● live</span> · last sync 4m ago
        </span>
        <span>
          {statusRight ?? (
            <>
              {sortedPlayers.length} rows · sort: {sortKey} {sortDir}
            </>
          )}
        </span>
      </div>
    </div>
  );

  const headerRow = (
    <thead>
      <tr>
        <th>#</th>
        <HeaderCell
          label="Player"
          sortKey="name"
          activeKey={sortKey}
          dir={sortDir}
          onSort={handleSort}
        />
        <HeaderCell
          label="Pos"
          sortKey="pos"
          activeKey={sortKey}
          dir={sortDir}
          onSort={handleSort}
        />
        <HeaderCell
          label="Pts"
          sortKey="pts"
          align="right"
          activeKey={sortKey}
          dir={sortDir}
          onSort={handleSort}
        />
        <HeaderCell
          label="Haul %"
          sortKey="haul"
          align="right"
          activeKey={sortKey}
          dir={sortDir}
          onSort={handleSort}
        />
        <HeaderCell
          label="Avail"
          sortKey="avail"
          activeKey={sortKey}
          dir={sortDir}
          onSort={handleSort}
        />
      </tr>
    </thead>
  );

  if (loading) {
    return renderTerminalShell(
      <div className={styles.tableContainer}>
        <table className={styles.playerTable}>
          {headerRow}
          <tbody>
            {[0, 1, 2, 3, 4].map((i) => (
              <tr key={i} className={styles.skeletonRow}>
                <td>
                  <div className={styles.skeleton} />
                </td>
                <td>
                  <div className={styles.skeleton} />
                </td>
                <td>
                  <div className={styles.skeleton} />
                </td>
                <td>
                  <div className={styles.skeleton} />
                </td>
                <td>
                  <div className={styles.skeleton} />
                </td>
                <td>
                  <div className={styles.skeleton} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
      <>loading…</>
    );
  }

  if (error) {
    return renderTerminalShell(
      <div className={styles.errorState}>
        <i className="bi bi-exclamation-triangle" aria-hidden="true"></i>
        <p>{error}</p>
        <button className={styles.retryButton} onClick={onRetry}>
          <i className="bi bi-arrow-clockwise" aria-hidden="true"></i> Retry
        </button>
      </div>,
      <>error</>
    );
  }

  if (sortedPlayers.length === 0) {
    return renderTerminalShell(
      <div className={styles.emptyState}>
        <p>No data available</p>
      </div>,
      <>0 rows</>
    );
  }

  return renderTerminalShell(
    <div className={styles.tableContainer}>
      <table className={styles.playerTable}>
        {headerRow}
        <tbody>
          {sortedPlayers.map((player, index) => {
            // The API already returns haul_probability on a 0..100 percentage
            // scale (auto-haaland inference: predict_proba × 100). Render as-is.
            const haulPct = player.haul_probability;
            const avail = getAvailMeta(player.chance_of_playing);
            return (
              <tr key={`${player.player_name}-${index}`}>
                <td className={styles.indexCell}>{index + 1}</td>
                <td className={styles.playerName}>{player.player_name}</td>
                <td>
                  <span
                    className={`${styles.posChip} ${getPosClass(player.position)}`}
                  >
                    {player.position}
                  </span>
                </td>
                <td className={`${styles.tdRight} ${styles.pointsCell}`}>
                  {player.predicted_points.toFixed(1)}
                </td>
                <td className={styles.tdRight}>
                  <HaulBar pct={haulPct} />
                </td>
                <td>
                  <span
                    className={styles.availCell}
                    style={{ color: avail.color }}
                  >
                    <span
                      className={styles.availDot}
                      style={{
                        background: avail.color,
                        boxShadow: `0 0 6px ${avail.color}`,
                      }}
                    />
                    {avail.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
