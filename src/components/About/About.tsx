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
        <p>Hi, I&apos;m Juan — a Backend Software Engineer based in Brisbane with over 3 years of experience building secure, high-performance systems. I hold an AWS Solutions Architect Associate certification and a Computer Science degree from the University of Queensland.</p>
        <p>I&apos;ve worked across healthcare and government sectors, where I&apos;ve delivered meaningful impact — from optimising API integrations to automating manual workflows. I enjoy solving complex problems and building solutions that make a real difference.</p>
        <p>Outside of work, I&apos;m always tinkering with side projects and exploring new technologies. Feel free to connect — I&apos;d love to chat!</p>
      </div>
    </div>
  );
}
