import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <div className={styles.contact}>
          <div className={styles.heading}>Let&apos;s connect.</div>
        </div>
        <div className={styles.socialIcons}>
          <a
            href="https://www.linkedin.com/in/juan-espares/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="linkedin"
            className={styles.iconButton}
          >
            <i className="bi bi-linkedin"></i>
          </a>
          <a
            href="https://github.com/juanE98"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="github"
            className={styles.iconButton}
          >
            <i className="bi bi-github"></i>
          </a>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <span className={styles.copyright}>
          &copy; 2026 Juan Espares. All rights reserved.
        </span>
        <span className={styles.version}>
          coffee-driven development &middot; v2.0
        </span>
      </div>
    </footer>
  );
}
