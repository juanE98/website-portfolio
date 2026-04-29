'use client';

import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import styles from './About.module.scss';

const FACTS: { k: string; v: string }[] = [
  { k: 'Location', v: 'Brisbane, AU' },
  { k: 'Role', v: 'Backend Engineer' },
  { k: 'Stack', v: 'Java \u00B7 Spring \u00B7 .NET' },
  { k: 'Cloud', v: 'AWS SAA-C03' },
  { k: 'Edu', v: 'BCompSci, UQ' },
  { k: 'IRL', v: 'Padel \u00B7 football \u00B7 health analytics' },
];

export default function About() {
  const containerRef = useScrollVisibility({
    selector: `.${styles.reveal}`,
    visibilityThreshold: 0.2,
  });

  return (
    <div className={styles.aboutContainer} ref={containerRef}>
      <div className={`${styles.sectionHeader} ${styles.reveal}`}>
        <div className={styles.cmdLine}>
          <span className={styles.cmdPrompt}>$</span> cat ./about.md
        </div>
        <div className={styles.titleRow}>
          <span className={styles.indexNum}>01.</span>
          <h2>About myself</h2>
          <span className={styles.titleRule} aria-hidden="true" />
          <span className={styles.kicker}>A LITTLE CONTEXT</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.proseColumn} ${styles.reveal}`}>
          <div className={styles.prose}>
            <p>
              Hi, I&apos;m Juan. I&apos;m a <strong>software engineer</strong> based in Brisbane with
              over 3 years of experience. I studied Computer Science at the University of Queensland
              after a detour through pharmaceutics, which is probably why I still gravitate toward
              health-related work. I picked up my <span className={styles.accent}>AWS Solutions Architect</span>{' '}
              Associate along the way.
            </p>
            <p>
              I&apos;ve worked across healthcare and government sectors, optimising API integrations
              and automating manual workflows. I enjoy taking something messy or painful and making
              it quiet and reliable.
            </p>
            <p>
              Outside of work, you&apos;ll find me on the padel courts, tinkering with side projects,
              or diving into football and health analytics. Feel free to connect, I&apos;d love to chat!
            </p>
          </div>
        </div>

        <div className={`${styles.factsColumn} ${styles.reveal}`}>
          <dl className={styles.facts}>
            {FACTS.map((f) => (
              <div key={f.k} className={styles.factRow}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
