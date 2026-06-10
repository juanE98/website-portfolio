'use client';

import { useRef, RefObject } from 'react';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { timelineEvents } from '@/data/timelineEvents';
import styles from './Timeline.module.scss';

// Isolated so the per-frame scroll progress updates only re-render this
// one div, not the whole timeline list.
function SpineLit({ wrapRef }: { wrapRef: RefObject<HTMLDivElement | null> }) {
  const progress = useScrollProgress(wrapRef);
  const scale = Math.max(0, Math.min(1, (progress - 0.1) * 1.4));

  return (
    <div
      className={styles.spineLit}
      aria-hidden="true"
      style={{ transform: `scaleY(${scale})` }}
    />
  );
}

export default function Timeline() {
  const containerRef = useScrollVisibility({
    selector: `.${styles.timelineItem}`,
    visibilityThreshold: 0.2,
  });
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.timelineContainer} ref={containerRef}>
      {/* Section header */}
      <div className={styles.sectionHeader}>
        <div className={styles.cmdLine}>
          <span className={styles.cmdPrompt}>$</span> git log --oneline --graph --since=2016
        </div>
        <div className={styles.titleRow}>
          <span className={styles.indexNum}>03.</span>
          <h2 className={styles.timelineTitle}>Experience</h2>
          <span className={styles.titleRule} aria-hidden="true" />
          <span className={styles.kicker}>THE PATH SO FAR</span>
        </div>
      </div>

      <div className={styles.timeline} ref={wrapRef}>
        {/* dim spine */}
        <div className={styles.spine} aria-hidden="true" />
        {/* lit overlay spine */}
        <SpineLit wrapRef={wrapRef} />

        {timelineEvents.map((event, index) => {
          const isEdu = event.type === 'edu';
          const sideClass = index % 2 === 0 ? styles.left : styles.right;
          return (
            <div
              key={index}
              className={`${styles.timelineItem} ${sideClass} ${
                isEdu ? styles.edu : styles.work
              }`}
            >
              {/* node circle */}
              <div className={styles.node} aria-hidden="true">
                <div className={styles.nodeInner} />
              </div>

              <div className={styles.content}>
                <div className={styles.metaRow}>
                  <span
                    className={`${styles.pill} ${
                      isEdu ? styles.pillEdu : styles.pillWork
                    }`}
                  >
                    {isEdu ? 'EDU' : 'WORK'}
                  </span>
                  <span className={styles.period}>{event.period}</span>
                </div>

                <h3>{event.role}</h3>
                <div className={styles.companyLine}>
                  <span className={styles.companyAt}>@</span>{' '}
                  <span className={styles.companyName}>{event.company}</span>
                </div>

                {event.description && <p>{event.description}</p>}

                {event.bullets.length > 0 && (
                  <ul className={styles.bullets}>
                    {event.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
