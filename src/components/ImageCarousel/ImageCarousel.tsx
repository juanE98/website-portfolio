'use client';

import { useState, type CSSProperties } from 'react';
import styles from './ImageCarousel.module.scss';

type Tech = {
  name: string;
  tag: string;
  slug: string; // simpleicons.org slug, or '' if using a local asset
  color: string; // hex without leading '#'
  blurb: string;
  localIcon?: string; // path to a local asset, used as fallback / preference over CDN
};

const TECH: Tech[] = [
  { name: 'Java',         tag: 'Backend',  slug: '',           color: 'ed8b00', blurb: 'My daily driver. Spring Boot APIs, the works.', localIcon: '/website-portfolio/assets/icons/java-cup.svg' },
  { name: 'Spring Boot',  tag: 'Backend',  slug: 'springboot', color: '6db33f', blurb: 'REST + Security + Data JPA. Production-grade backends.' },
  { name: 'PostgreSQL',   tag: 'Data',     slug: 'postgresql', color: '4169e1', blurb: 'Schema design, query tuning, indexes that actually help.' },
  { name: 'AWS',          tag: 'Cloud',    slug: '',           color: 'ff9900', blurb: 'Solutions Architect Associate. Lambda, API Gateway, RDS.', localIcon: '/website-portfolio/assets/icons/21.png' },
  { name: 'Docker',       tag: 'DevOps',   slug: 'docker',     color: '2496ed', blurb: 'Local dev parity, CI image builds, multi-stage Dockerfiles.' },
  { name: 'Kubernetes',   tag: 'DevOps',   slug: 'kubernetes', color: '326ce5', blurb: 'Deployed .NET microservices on GKE in production.' },
  { name: '.NET / C#',    tag: 'Backend',  slug: 'dotnet',     color: '512bd4', blurb: 'Two roles in .NET \u2014 micro and monolith flavours.' },
  { name: 'TypeScript',   tag: 'Frontend', slug: 'typescript', color: '3178c6', blurb: 'When backend folks need a frontend that doesn\u2019t fall over.' },
  { name: 'React',        tag: 'Frontend', slug: 'react',      color: '61dafb', blurb: 'End-to-end work on a care management system frontend.' },
  { name: 'Angular',      tag: 'Frontend', slug: 'angular',    color: 'dd0031', blurb: 'Customer portal work at Dye & Durham.' },
  { name: 'Python',       tag: 'Data',     slug: 'python',     color: '3776ab', blurb: 'FPL data crunching and health-analytics scripts.' },
  { name: 'Git',          tag: 'DevOps',   slug: 'git',        color: 'f05032', blurb: 'Rebase, bisect, the lot. Trunk-based by default.' },
  { name: 'Linux',        tag: 'DevOps',   slug: 'linux',      color: 'e6edf3', blurb: 'Comfortable in a shell. Bash scripts where it counts.' },
  { name: 'Node.js',      tag: 'Backend',  slug: 'nodedotjs',  color: '5fa04e', blurb: 'Express reverse proxy fronting a Synology NAS. Adds the RBAC layer DSM doesn’t ship with.' },
  { name: 'GitHub Actions', tag: 'DevOps', slug: 'githubactions', color: '2088ff', blurb: 'CI/CD for build, test, and deploy of this portfolio.' },
  { name: 'Claude Code',  tag: 'AI',       slug: 'claude',     color: 'd97757', blurb: 'My daily AI pair-programming workflow.' },
];

const iconUrl = (tech: Tech) =>
  tech.localIcon ?? `https://cdn.simpleicons.org/${tech.slug}/${tech.color}`;

export default function ImageCarousel() {
  const [focused, setFocused] = useState<Tech>(TECH[0]);
  const focusedIndex = TECH.findIndex((t) => t.name === focused.name);

  const renderChip = (t: Tech, key: string) => {
    const isFocused = focused.name === t.name;
    return (
      <button
        key={key}
        type="button"
        className={`${styles.chip} ${isFocused ? styles.chipActive : ''}`}
        onClick={() => setFocused(t)}
        aria-label={`Focus ${t.name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Technology icon"
          src={iconUrl(t)}
          width={20}
          height={20}
          loading="lazy"
          decoding="async"
          className={styles.chipIcon}
        />
        <span className={styles.chipName}>{t.name}</span>
        <span className={styles.chipTag}>{t.tag.toUpperCase()}</span>
      </button>
    );
  };

  return (
    <div className={styles.techSection}>
      {/* Section header */}
      <div className={styles.sectionHeader}>
        <div className={styles.cmdLine}>
          <span className={styles.cmdPrompt}>$</span> ls -la ./stack/
        </div>
        <div className={styles.titleRow}>
          <span className={styles.indexNum}>02.</span>
          <h2>Technologies</h2>
          <span className={styles.titleRule} aria-hidden="true" />
          <span className={styles.kicker}>THE STACK</span>
        </div>
      </div>

      {/* Focus card */}
      <div
        className={styles.focusCard}
        style={{ '--focus-color': `#${focused.color}` } as CSSProperties}
      >
        <div className={styles.focusIconTile}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Technology icon"
            src={iconUrl(focused)}
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            className={styles.focusIcon}
          />
        </div>
        <div className={styles.focusBody}>
          <div className={styles.focusTag}>{focused.tag}</div>
          <h3 className={styles.focusName}>{focused.name}</h3>
          <p className={styles.focusBlurb}>{focused.blurb}</p>
        </div>
        <div className={styles.focusCounter}>
          {String(focusedIndex + 1).padStart(2, '0')} / {String(TECH.length).padStart(2, '0')}
        </div>
      </div>

      {/* Marquee strip */}
      <div className={styles.marqueeMask}>
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeGroup}>
            {TECH.map((t) => renderChip(t, `a-${t.name}`))}
          </div>
          <div className={styles.marqueeGroup} aria-hidden="true">
            {TECH.map((t) => renderChip(t, `b-${t.name}`))}
          </div>
        </div>
      </div>

      <div className={styles.hint}>HOVER TO PAUSE &middot; CLICK A CHIP TO FOCUS</div>
    </div>
  );
}
