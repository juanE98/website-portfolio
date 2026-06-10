'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import styles from './Home.module.scss';

const typingTexts = [
  'I write code.',
  'I build software',
  'I fix software',
  'I optimise systems',
  'I design system architecture',
  'I solve problems',
  'I secure systems',
];

const ACCENT = '#22d3ee';
const SECONDARY = '#f59e0b';

type BootLine = {
  tag: string;
  text: string;
  color: string;
};

const BOOT_LINES: BootLine[] = [
  { tag: 'OK', text: 'mounted /dev/brain', color: SECONDARY },
  { tag: 'INFO', text: 'loaded modules: java, spring, aws', color: ACCENT },
  { tag: 'OK', text: 'kernel coffee.service active (running)', color: SECONDARY },
];

function BootSequence() {
  return (
    <div className={styles.bootSequence}>
      {BOOT_LINES.map((line, i) => (
        <div
          key={i}
          className={styles.bootLine}
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <span className={styles.bootBracket}>[</span>
          <span className={styles.bootTag} style={{ color: line.color }}>
            {' '}
            {line.tag.padEnd(4, ' ')}{' '}
          </span>
          <span className={styles.bootBracket}>]</span>{' '}
          <span>{line.text}</span>
        </div>
      ))}
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statNumber}>{n}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PortraitStack() {
  return (
    <div className={styles.portraitStack}>
      <svg viewBox="0 0 400 400" className={styles.portraitRing} aria-hidden>
        <defs>
          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor={ACCENT} stopOpacity="0" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0.3" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="198" fill="url(#ringGlow)" />
        {[197, 193, 189].map((r, i) => (
          <g key={r} opacity={0.55 - i * 0.12}>
            <circle
              cx="200"
              cy="200"
              r={r}
              fill="none"
              stroke={ACCENT}
              strokeWidth="0.3"
              strokeDasharray={`${4 + i * 8} ${20 + i * 4}`}
            />
          </g>
        ))}
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const x = (200 + Math.cos(angle) * 197).toFixed(3);
          const y = (200 + Math.sin(angle) * 197).toFixed(3);
          return <circle key={i} cx={x} cy={y} r="0.9" fill={ACCENT} fillOpacity="0.85" />;
        })}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * Math.PI * 2 + 0.2;
          const x1 = (200 + Math.cos(angle) * 191).toFixed(3);
          const y1 = (200 + Math.sin(angle) * 191).toFixed(3);
          const x2 = (200 + Math.cos(angle) * 202).toFixed(3);
          const y2 = (200 + Math.sin(angle) * 202).toFixed(3);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={ACCENT}
              strokeWidth="0.3"
              opacity="0.55"
            />
          );
        })}
      </svg>

      <div className={styles.portraitPhotoWrapper}>
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
  );
}

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

    window.addEventListener('scroll', handleScroll, { passive: true });
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
      <div className={styles.heroGrid}>
        <div className={styles.textColumn}>
          <BootSequence />

          <span className={styles.brandLabel}>Juan Espares</span>

          <h1 className={styles.greeting}>
            Hi, I&apos;m Juan<span className={styles.accentDot}>.</span>
          </h1>

          <div className={styles.typingContainer}>
            <span className={styles.prompt}>$</span>{' '}
            <span className={styles.typedText}>{currentText}</span>
            <span className={styles.cursor}>|</span>
          </div>

          <p className={styles.blurb}>
            Backend software engineer based in Brisbane. I work primarily in Java and Spring Boot,
            building APIs and integrations that quietly do their job.
          </p>

          <div className={styles.buttonRow}>
            <a href="#projects" className={styles.btnPrimary}>
              <span>./see-my-work</span>
              <Arrow />
            </a>
            <a href="#about" className={styles.btnGhost}>
              cat about.md
            </a>
          </div>

          <div className={styles.statRow}>
            <Stat n="3+" label="Years shipping" />
            <Stat n="AWS" label="SAA Certified" />
            <Stat n="UQ" label="CompSci grad" />
          </div>
        </div>

        <div className={styles.portraitColumn}>
          <PortraitStack />
        </div>
      </div>

      <button
        className={`${styles.arrowButton} ${arrowHidden ? styles.hidden : ''}`}
        onClick={scrollToTechnologies}
        aria-label="Scroll to technologies"
      >
        <i className="bi bi-arrow-down-circle"></i>
      </button>
    </div>
  );
}
