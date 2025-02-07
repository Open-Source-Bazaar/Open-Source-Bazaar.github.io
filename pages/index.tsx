import { Card, Col, Row } from 'react-bootstrap';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactTyped from 'react-typed-component';

import { PageHead } from '../components/PageHead';
import styles from '../styles/Home.module.scss';

const HomePage = () => (
  <>
    <PageHead />

    <section
      className={`flex-fill d-flex flex-column justify-content-center align-items-center bg-secondary bg-gradient text-dark bg-opacity-10 ${styles.main}`}
    >
      <h2 className={`m-0 text-center ${styles.title}`}>
        <ReactTyped
          backDelay={1}
          backSpeed={200}
          cursorChar="|"
          fadeOutDelay={100}
          loop
          loopCount={0}
          showCursor
          startDelay={0}
          strings={[
            renderToStaticMarkup(
              <>
                欢迎来到
                <strong>
                  <a
                    className="text-primary mx-2"
                    href="https://bazaar.fcc-cd.dev/"
                  >
                    开源市集
                  </a>
                </strong>
              </>,
            ),
            renderToStaticMarkup(
              <>
                欢迎参与<strong>开放式协作</strong>
              </>,
            ),
            renderToStaticMarkup(
              <>
                欢迎一起评选<strong>开放协作人奖</strong>
              </>,
            ),
          ]}
          typeSpeed={100}
        />
      </h2>
    </section>
    <section
      className={`flex-fill d-flex flex-column justify-content-center align-items-center pb-0 bg-warning bg-opacity-10 ${styles.main}`}
    >
      <h2 className="text-start mb-5 mt-5 fw-bolder">参与</h2>
      <Row className="flex-fill d-flex justify-content-around align-items-center w-100 px-3">
        <Col xs={8} sm={7} md={4} className="pb-5">
          <Card body className={`shadow ${styles.activeCard}`}>
            <h5 className="fw-bold mb-3">代码工作</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a
                  href="https://github.com/Open-Source-Bazaar/Open-Source-Bazaar.github.io"
                  className="fw-bold"
                >
                  官网开发
                </a>
                ：研发官网，让更多人了解「开源市集」，了解「开放式协作」……
              </li>
              <li className="mb-3">
                <span className="fw-bold">……</span>
              </li>
            </ul>
          </Card>
        </Col>
        <Col xs={8} sm={7} md={4} className="pb-5">
          <Card body className={`shadow overflow-auto ${styles.activeCard}`}>
            <h5 className="fw-bold mb-3">非代码工作</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="/history" className="fw-bold">
                  开放市集
                </a>
                ：一群来自不同领域的有趣的朋友通过展示、交流，将“开源”和“开放式协作”的乐趣带给更多人……
              </li>
              <li className="mb-3">
                <a href="/open-collaborator-award" className="fw-bold">
                  开放协作人奖
                </a>
                ：在过去的一年中令你难以忘怀的人，请把 Ta 推荐给更多的人……
              </li>
              <li className="mb-3">
                <span className="fw-bold">……</span>
              </li>
            </ul>
          </Card>
        </Col>
        <Col xs={8} sm={7} md={4} className="pb-5">
          <Card body className={`shadow ${styles.activeCard}`}>
            <p>
              欢迎
              <a href="/join-us" className="fw-bold">
                成为共创人/方
              </a>
              ，更多内容/形式等你来共创……
            </p>
          </Card>
        </Col>
      </Row>
    </section>
    <section
      className={`flex-fill d-flex flex-column justify-content-center align-items-center pb-0 bg-success bg-opacity-10 ${styles.main}`}
    >
      <h2 className="text-start mb-5 fw-bolder h1">行动</h2>
      <Row className="d-flex flex-column justify-content-start align-items-center w-100 mb-5">
        <Col className="text-center">
          <figure className="text-center">
            <blockquote className="blockquote mb-4">
              <p className="h2">我们正在筹办 3 月开源市集，欢迎参与！</p>
            </blockquote>
            <figcaption className="h6 text-muted">
              即兴三月，开源开放！来都来了，玩就是了！👉
              <a
                href="https://open-source-bazaar.feishu.cn/docs/doccnGSsshgO4ojuAHVzWJMXWog?from=from_copylink"
                className="text-primary"
              >
                立刻协作
              </a>
            </figcaption>
          </figure>
        </Col>
      </Row>
    </section>
  </>
);

export default HomePage;
