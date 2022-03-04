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
        <Card body className="px-5 py-5 lh-base">
          <h1 className="text-center fw-bolder mb-4">关于开源市集</h1>
          <p>
            <span className="fw-bold fst-italic">
              「开源市集 Open Source Bazzar」
            </span>
            是一个以开源软硬件、公益项目为主题的公益活动品牌，也是一个以
            <span className="fw-bold fst-italic">「开放式协作」</span>
            为核心理念的开源社群。
          </p>
          <p>
            开源是一种基于国际互联网的全球性社会化协作模式。这个概念虽来自计算机软件行业，但其核心运作模式
            <span className="fw-bold fst-italic">「开放的社会化协作」</span>
            则是可以脱离技术本身、放之四海而皆准的新型生产力与生产关系，通用于各类商业、非商业组织。
          </p>
          <p>
            市集在世界范围内有着悠久的历史，促进了经济和文化交流。据「周易」记载，「神农氏作……日中为市，致天下之民，聚天下之货，交易而退，各得其所」。
          </p>
          <p>
            在开源市集中，一群来自科技、人文、艺术等不同领域的有趣的朋友通过展示、交流将「开源」和「开放式协作」的乐趣带给更多人，点亮更多有趣的灵魂，为社会带来正面影响。
          </p>
          <p>给世界带来美好改变，不是一个人做很多，而是每个人都做一点点。</p>
          <hr />
          <p>
            我们不给开源市集设定预期，比如要举办多大规模的活动或者要邀请多少共创人和共创方加入。我们希望通过真诚且有温度的表达，为自己，也为更多人营造一个社区：
          </p>
          <ul>
            <li className="mb-3">
              关注社区中的每一个人，去倾听一些平时没有机会发声或者不敢打开自己去发声的人们的声音，为
              ta 们创造一个安全的环境。
            </li>
            <li className="mb-3">
              让更多人身心获得放松和疗愈，接纳自己，然后和伙伴们一起实践更多美好行动，为世界带来和平。
            </li>
          </ul>
          <p>
            我们相信，不管你从哪里来，只要你投入热情，坚持做正确的事情，社区会让你慢慢了解你想去哪里，并且最终抵达。
          </p>
          <hr />
          <p>
            <span className="fw-bold">
              所有参与开源市集线上贡献或线下活动筹备的个人都是
              <span className="fst-italic">「共创人」</span>
            </span>
            ，例如：基础设施建设者、活动出品人、设计师、编辑、摆摊或组织工作坊的人们……
          </p>

          <p>
            <span className="fw-bold">
              所有参与开源市集线上贡献或线下活动筹备的社区、高校、企业、政府部门等机构、组织都是
              <span className="fst-italic">「共创方」</span>
            </span>
            ，例如：通过自己的官方社交媒体宣传开源市集的社区、提供物资的企业……
          </p>
        </Card>
      </Container>
    </main>
  </>
);

export default AboutPage;
