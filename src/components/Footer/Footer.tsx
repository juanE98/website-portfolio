import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.socialIcons}>
        <a href="https://www.linkedin.com/in/juan-espares/" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-linkedin"></i>
        </a>
        <a href="https://github.com/juanE98" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-github"></i>
        </a>
      </div>
      <div className={styles.copyright}>
        &copy; 2024 Juan Espares. All rights reserved.
      </div>
    </footer>
  );
}
