'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useHeaderVisibility } from '@/hooks/useHeaderVisibility';
import styles from './Header.module.scss';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHidden = useHeaderVisibility();

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-interaction');
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-interaction');
  }, []);

  const goToPart = useCallback((fragment: string) => {
    const element = document.getElementById(fragment);
    if (element) {
      const headerHeight = 55;
      const elementRect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offsetPosition = elementRect.top + scrollTop - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL fragment
      window.history.pushState(null, '', `#${fragment}`);
    }
  }, []);

  const handleNavClick = useCallback((fragment: string) => {
    closeMenu();
    goToPart(fragment);
  }, [closeMenu, goToPart]);

  return (
    <header className={`${styles.header} ${isHidden ? styles.hidden : ''}`}>
      <Image
        src="/website-portfolio/assets/je-logo.png"
        alt="Logo"
        className={styles.logo}
        width={100}
        height={40}
        onClick={() => goToPart('home')}
        priority
      />

      <nav className={styles.desktopMenuNav}>
        <ul>
          <li onClick={() => goToPart('home')}>Home</li>
          <li onClick={() => goToPart('technologies')}>Technologies</li>
          <li onClick={() => goToPart('about')}>About Me</li>
          <li onClick={() => goToPart('experience')}>Experience</li>
        </ul>
      </nav>

      <div className={styles.menuIconOpen} onClick={openMenu}>
        <i className="bi bi-list"></i>
      </div>

      <div className={`${styles.mobileMenuPanel} ${menuOpen ? styles.active : ''}`}>
        <div className={styles.menuIconClose} onClick={closeMenu}>
          <i className="bi bi-x"></i>
        </div>
        <ul>
          <li onClick={() => handleNavClick('home')}>Home</li>
          <li onClick={() => handleNavClick('technologies')}>Technologies</li>
          <li onClick={() => handleNavClick('about')}>About Me</li>
          <li onClick={() => handleNavClick('experience')}>Experience</li>
        </ul>
      </div>
    </header>
  );
}
