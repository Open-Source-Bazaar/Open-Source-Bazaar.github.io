import { Container, Card } from 'react-bootstrap';
import PageHead from '../components/PageHead';
import styles from '../styles/Home.module.scss';

const AboutPage = () => (
  <>
    <PageHead />

    <main
      className={`flex-fill d-flex flex-column justify-content-start align-items-center bg-secondary bg-gradient text-dark bg-opacity-10 ${styles.main}`}
    >
      <Container>
        <Card body className="px-5 py-5">
          <h1 className="text-center fw-bolder mb-4">关于开源市集</h1>
          <p>
            <span className="fw-bold">「开源市集 Open Source Bazzar」</span>
            是一个以开源软硬件、公益项目为主题的公益活动品牌，也是一个以
            <span className="fw-bold">「开放式协作」</span>
            为核心理念的开源社群。
          </p>
          <p>
            开源是一种基于国际互联网的全球性社会化协作模式。这个概念虽来自计算机软件行业，但其核心运作模式
            <span className="fw-bold">「开放的社会化协作」</span>
            则是可以脱离技术本身、放之四海而皆准的新型生产力与生产关系，通用于各类商业、非商业组织。
          </p>
          <p>
            市集在世界范围内有着悠久的历史，促进了经济和文化交流。据「周易」记载，「神农氏作……日中为市，致天下之民，聚天下之货，交易而退，各得其所」。
          </p>
          <p>
            在开源市集中，一群来自科技、人文、艺术等不同领域的有趣的朋友通过展示、交流将「开源」和「开放式协作」的乐趣带给更多人，点亮更多有趣的灵魂，为社会带来正面影响。
          </p>
          <p>给世界带来美好改变，不是一个人做很多，而是每个人都做一点点。</p>
        </Card>
      </Container>
    </main>
  </>
);

export default AboutPage;
