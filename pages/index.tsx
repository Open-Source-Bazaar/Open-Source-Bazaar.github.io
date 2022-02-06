import PageHead from '../components/PageHead';
import styles from '../styles/Home.module.scss';

const HomePage = () => (
  <>
    <PageHead />

    <main
      className={`flex-fill d-flex flex-column justify-content-center align-items-center ${styles.main}`}
    >
      <h1 className={`m-0 text-center ${styles.title}`}>
        Welcome to
        <a className="text-primary mx-2" href="https://nextjs.org">
          Next.js!
        </a>
      </h1>

      <p className={`text-center fs-4 ${styles.description}`}>
        Get started by editing
        <code className={`mx-2 rounded-3 bg-light ${styles.code}`}>
          pages/index.tsx
        </code>
      </p>
    </main>
  </>
);

export default HomePage;
