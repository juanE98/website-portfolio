'use client';

import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { timelineEvents } from '@/data/timelineEvents';
import styles from './Timeline.module.scss';

export default function Timeline() {
  const containerRef = useScrollVisibility({
    selector: `.${styles.timelineItem}`,
    visibilityThreshold: 0.3
  });

  return (
    <div className={styles.timelineContainer} ref={containerRef}>
      <h2 className={styles.timelineTitle}>Experience</h2>
      <div className={styles.timeline}>
        {timelineEvents.map((event, index) => (
          <div
            key={index}
            className={`${styles.timelineItem} ${index % 2 === 0 ? styles.left : styles.right}`}
          >
            <div className={styles.circle}></div>
            <div className={styles.content}>
              <h3>{event.title}</h3>
              <h4>{event.subtitle}</h4>
              {event.description && <p>{event.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
