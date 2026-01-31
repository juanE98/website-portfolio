'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import styles from './Home.module.scss';

const typingTexts = [
  'I write code',
  'I build software',
  'I fix software',
  'I optimise systems',
  'I design system architecture',
  'I solve problems',
  'I secure systems'
];

export default function Home() {
  const [arrowHidden, setArrowHidden] = useState(false);
  const currentText = useTypingAnimation({
    texts: typingTexts,
    typeSpeed: 100,
    deleteSpeed: 75,
    pauseDuration: 1000,
  });

  useEffect(() => {
    const handleScroll = () => {
      setArrowHidden(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTechnologies = useCallback(() => {
    const technologiesSection = document.getElementById('technologies');
    if (technologiesSection) {
      technologiesSection.scrollIntoView({ behavior: 'smooth' });
      setArrowHidden(true);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.heroContent}>
        <div className={styles.textContent}>
          <div className={styles.nameBadge}>Juan Espares</div>
          <h1 className={styles.greeting}>Hi, I&apos;m Juan</h1>
          <div className={styles.typingContainer}>
            <span className={styles.typedText}>{currentText}</span>
            <span className={styles.cursor}>|</span>
          </div>
        </div>

        <div className={styles.profileImage}>
          <Image
            src="/website-portfolio/assets/homeJuan.jpg"
            alt="Juan Espares"
            className={styles.profilePhoto}
            width={700}
            height={700}
            priority
          />
        </div>
      </div>

      <button
        className={`${styles.arrowButton} ${arrowHidden ? styles.hidden : ''}`}
        onClick={scrollToTechnologies}
      >
        <i className="bi bi-arrow-down-circle"></i>
      </button>
    </div>
  );
}
