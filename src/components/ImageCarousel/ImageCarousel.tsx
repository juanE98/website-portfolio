'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import styles from './ImageCarousel.module.scss';

export default function ImageCarousel() {
  const allIcons = useMemo(() => {
    const icons: string[] = [];
    for (let i = 5; i <= 20; i++) {
      icons.push(`/website-portfolio/assets/icons/${i}.svg`);
    }
    // Add AWS icon (png format)
    icons.push('/website-portfolio/assets/icons/21.png');
    // Create 3 copies for seamless infinite scroll
    return [...icons, ...icons, ...icons];
  }, []);

  return (
    <div className={styles.carousel}>
      <div className={styles.scrollContainer}>
        <div className={styles.scrollTrack}>
          {allIcons.map((icon, index) => (
            <Image
              key={index}
              src={icon}
              alt="Technology icon"
              className={styles.scrollItem}
              width={280}
              height={448}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
