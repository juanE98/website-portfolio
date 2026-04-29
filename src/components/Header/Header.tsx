'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHeaderVisibility } from '@/hooks/useHeaderVisibility';
import styles from './Header.module.scss';

const ACCENT = '#22d3ee';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('home');
  const isHidden = useHeaderVisibility();
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const isFplPage = pathname.includes('/fpl');

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

  // Scroll-driven background flag
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver — track active section on home page only
  useEffect(() => {
    if (!isHomePage) return;

    const ids = ['home', 'technologies', 'about', 'experience', 'projects'];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isHomePage]);

  // Navigation items for home page sections
  const homeNavItems = [
    { fragment: 'home', label: 'Home' },
    { fragment: 'about', label: 'About Me' },
    { fragment: 'technologies', label: 'Technologies' },
    { fragment: 'experience', label: 'Experience' },
    { fragment: 'projects', label: 'Personal Projects' },
  ];

  const FPL_INDEX = homeNavItems.length; // FPL sits one slot after the section list

  const formatIndex = (n: number) => String(n).padStart(2, '0');

  const headerClass = `${styles.header} ${scrolled ? styles.scrolled : ''} ${isHidden ? styles.hidden : ''}`.trim();

  const logoImage = (
    <Image
      src="/website-portfolio/assets/je-logo.png"
      alt="Logo"
      className={styles.logo}
      width={100}
      height={40}
      priority
    />
  );

  const brandText = (
    <span className={styles.brandText}>
      juan<span className={styles.brandDot}>.</span>espares
    </span>
  );

  return (
    <header className={headerClass}>
      {isHomePage ? (
        <button
          type="button"
          className={styles.brand}
          onClick={() => goToPart('home')}
          aria-label="Go to home"
        >
          {logoImage}
          {brandText}
        </button>
      ) : (
        <Link href="/" className={styles.brand} aria-label="Go to home">
          {logoImage}
          {brandText}
        </Link>
      )}

      <nav className={styles.desktopMenuNav}>
        <ul>
          {isFplPage ? (
            <li>
              <Link href="/" className={`${styles.navItem} ${styles.navItemActive}`}>
                <span className={styles.navIndex}>{formatIndex(0)}</span>
                Home
                <span className={styles.navUnderline} />
              </Link>
            </li>
          ) : isHomePage ? (
            <>
              {homeNavItems.map((item, idx) => {
                const isActive = active === item.fragment;
                return (
                  <li
                    key={item.fragment}
                    onClick={() => goToPart(item.fragment)}
                    className={isActive ? styles.navItemActive : ''}
                  >
                    <span className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                      <span className={styles.navIndex}>{formatIndex(idx)}</span>
                      {item.label}
                      {isActive && <span className={styles.navUnderline} style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />}
                    </span>
                  </li>
                );
              })}
              <li>
                <Link href="/fpl" className={styles.navItem}>
                  <span className={styles.navIndex}>{formatIndex(FPL_INDEX)}</span>
                  FPL
                </Link>
              </li>
            </>
          ) : (
            <>
              {homeNavItems.map((item, idx) => (
                <li key={item.fragment}>
                  <Link href={`/#${item.fragment}`} className={styles.navItem}>
                    <span className={styles.navIndex}>{formatIndex(idx)}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/fpl" className={styles.navItem}>
                  <span className={styles.navIndex}>{formatIndex(FPL_INDEX)}</span>
                  FPL
                </Link>
              </li>
            </>
          )}
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
          {isFplPage ? (
            <li onClick={closeMenu}>
              <Link href="/">
                <span className={styles.navIndex}>{formatIndex(0)}</span>
                Home
              </Link>
            </li>
          ) : isHomePage ? (
            <>
              {homeNavItems.map((item, idx) => (
                <li
                  key={item.fragment}
                  onClick={() => handleMobileNavClick(item.fragment)}
                >
                  <span className={styles.navIndex}>{formatIndex(idx)}</span>
                  {item.label}
                </li>
              ))}
              <li onClick={closeMenu}>
                <Link href="/fpl">
                  <span className={styles.navIndex}>{formatIndex(FPL_INDEX)}</span>
                  FPL
                </Link>
              </li>
            </>
          ) : (
            <>
              {homeNavItems.map((item, idx) => (
                <li key={item.fragment} onClick={closeMenu}>
                  <Link href={`/#${item.fragment}`}>
                    <span className={styles.navIndex}>{formatIndex(idx)}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li onClick={closeMenu}>
                <Link href="/fpl">
                  <span className={styles.navIndex}>{formatIndex(FPL_INDEX)}</span>
                  FPL
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
