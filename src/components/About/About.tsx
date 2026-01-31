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
        <p>Hi, I&apos;m Juan. My passion for software development started with my interest in maths and technology in school. Building my PC sparked my interest in hardware, which then led me to discover programming.</p>
        <p>I specialise in backend development, focusing on performance optimisation, security, integrations, and business logic processing. My career goal is to become the best developer I can be while learning from others as well as helping others along the way.</p>
        <p>I believe this field has unlimited potential, which motivates me to continuously improve and learn something new every day.</p>
      </div>
    </div>
  );
}
