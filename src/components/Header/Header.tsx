'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHeaderVisibility } from '@/hooks/useHeaderVisibility';
import styles from './Header.module.scss';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHidden = useHeaderVisibility();
  const pathname = usePathname();

  const isHomePage = pathname === '/' || pathname === '/website-portfolio';

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

  const handleMobileNavClick = useCallback((fragment: string) => {
    closeMenu();
    if (isHomePage) {
      goToPart(fragment);
    }
  }, [closeMenu, goToPart, isHomePage]);

  // Navigation items for home page sections
  const homeNavItems = [
    { fragment: 'home', label: 'Home' },
    { fragment: 'technologies', label: 'Technologies' },
    { fragment: 'about', label: 'About Me' },
    { fragment: 'experience', label: 'Experience' },
  ];

  return (
    <header className={`${styles.header} ${isHidden ? styles.hidden : ''}`}>
      {isHomePage ? (
        <Image
          src="/website-portfolio/assets/je-logo.png"
          alt="Logo"
          className={styles.logo}
          width={100}
          height={40}
          onClick={() => goToPart('home')}
          priority
        />
      ) : (
        <Link href="/website-portfolio">
          <Image
            src="/website-portfolio/assets/je-logo.png"
            alt="Logo"
            className={styles.logo}
            width={100}
            height={40}
            priority
          />
        </Link>
      )}

      <nav className={styles.desktopMenuNav}>
        <ul>
          {isHomePage ? (
            <>
              {homeNavItems.map((item) => (
                <li key={item.fragment} onClick={() => goToPart(item.fragment)}>
                  {item.label}
                </li>
              ))}
            </>
          ) : (
            <>
              {homeNavItems.map((item) => (
                <li key={item.fragment}>
                  <Link href={`/website-portfolio#${item.fragment}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </>
          )}
          <li className={!isHomePage && pathname.includes('/fpl') ? styles.activeNav : ''}>
            <Link href="/website-portfolio/fpl">FPL</Link>
          </li>
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
          {isHomePage ? (
            <>
              {homeNavItems.map((item) => (
                <li key={item.fragment} onClick={() => handleMobileNavClick(item.fragment)}>
                  {item.label}
                </li>
              ))}
            </>
          ) : (
            <>
              {homeNavItems.map((item) => (
                <li key={item.fragment} onClick={closeMenu}>
                  <Link href={`/website-portfolio#${item.fragment}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </>
          )}
          <li onClick={closeMenu}>
            <Link href="/website-portfolio/fpl">FPL</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
