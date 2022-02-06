import PageHead from '../components/PageHead';
import styles from '../styles/Home.module.scss';

const HomePage = () => (
  <>
    <PageHead />

    <main
      className={`flex-fill d-flex flex-column justify-content-center align-items-center ${styles.main}`}
    >
      <h1 className={`m-0 text-center ${styles.title}`}>
        欢迎来到
        <a
          className="text-primary mx-2"
          href="https://open-source-bazaar.github.io/"
        >
          开源市集!
        </a>
      </h1>
    </main>
  </>
);

export default HomePage;
