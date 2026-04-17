'use client';

import Image from 'next/image';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import styles from './About.module.scss';

export default function About() {
  const containerRef = useScrollVisibility({
    selector: `.${styles.column}`,
    visibilityThreshold: 0.3
  });

  return (
    <div className={styles.aboutContainer} ref={containerRef}>
      <div className={`${styles.column} ${styles.leftColumn}`}>
        <Image
          src="/website-portfolio/assets/juan-face.png"
          className={styles.profilePic}
          alt="Juan's face"
          width={450}
          height={450}
        />
      </div>
      <div className={`${styles.column} ${styles.rightColumn}`}>
        <h2>About myself</h2>
        <p>Hi, I&apos;m Juan. I&apos;m a backend software engineer based in Brisbane with over 3 years of experience. I studied Computer Science at the University of Queensland after a detour through pharmaceutics, which is probably why I still gravitate toward health-related work. I picked up my AWS Solutions Architect Associate along the way.</p>
        <p>I&apos;ve worked across healthcare and government sectors, optimising API integrations and automating manual workflows. I enjoy taking something messy or painful and making it quiet and reliable.</p>
        <p>Outside of work, you&apos;ll find me on the padel courts, tinkering with side projects, or diving into football and health analytics. Feel free to connect, I&apos;d love to chat!</p>
      </div>
    </div>
  );
}
