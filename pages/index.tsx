import ReactTyped from 'react-typed-component';
import { Row, Col, Card } from 'react-bootstrap';
import PageHead from '../components/PageHead';
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
            "欢迎来到<strong><a className='text-primary mx-2' href='https://open-source-bazaar.github.io/'>开源市集</a></strong>",
            '欢迎参与<strong>开放式协作</strong>',
            '欢迎一起评选<strong>开放协作人奖</strong>',
          ]}
          typeSpeed={100}
          typedRef={function noRefCheck() {}}
        />
      </h2>
    </section>
    <section
      className={`flex-fill d-flex flex-column justify-content-center align-items-center pb-0 bg-warning bg-opacity-10 ${styles.main}`}
    >
      <h2 className="text-start mb-5 mt-5 fw-bolder">形式</h2>
      <Row className="flex-fill d-flex justify-content-around align-items-center w-100 px-3">
        <Col xs={8} sm={7} md={4} className="pb-5">
          <Card body className={`shadow ${styles.activeCard}`}>
            <a href="/history">
              <h5 className="fw-bold mb-3">开源市集</h5>
            </a>
            <p>
              一群来自科技、艺术、环保不同领域的有趣的朋友通过展示、交流，将“开源”和“开放式协作”的乐趣带给更多人，点亮更多有趣的灵魂，为社会带来正面影响。
            </p>
          </Card>
        </Col>
        <Col xs={8} sm={7} md={4} className="pb-5">
          <Card body className={`shadow ${styles.activeCard}`}>
            <a href="/open-collaborator-award">
              <h5 className="fw-bold mb-3">开放协作人奖</h5>
            </a>
            <p>
              开放协作人，在过去的一年中，是否有人给你带来感动，带来惊喜？是否有人与你一起成长，一起进步？也许是长此以往，或者说那一瞬间，如果有这样令你难以忘怀的人，请把
              Ta 推荐给更多的人。
            </p>
          </Card>
        </Col>
        <Col xs={8} sm={7} md={4} className="pb-5">
          <Card body className={`shadow ${styles.activeCard}`}>
            欢迎
            <strong>
              <a href="/join-us">成为共创人/方</a>
            </strong>
            ，更多内容/形式等你来共创……
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
