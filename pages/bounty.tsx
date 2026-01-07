import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

import { PageHead } from '../components/Layout/PageHead';
import { I18nContext } from '../models/Translation';
import styles from '../styles/Bounty.module.less';

type BountyViewProps = Record<'icon' | 'title' | 'url', string>;

const BountyView: FC<BountyViewProps> = ({ title, url, icon }) => (
  <Card className={`${styles.bountyCard} rounded-4`} body>
    <Card.Title as="h2" className="fs-5">
      {icon} <span className={styles.cardTitle}>{title}</span>
    </Card.Title>
    <div
      className={`${styles.iframeContainer} overflow-hidden w-100 rounded-4 position-relative`}
      style={{ height: 'calc(100vh - 10rem)' }}
    >
      <iframe className="border-0 h-100 w-100 rounded-4" title={title} loading="lazy" src={url} />
    </div>
  </Card>
);

const BountyPage: FC = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <>
      <PageHead title={t('bounty_page_title')} />

      <section className={styles.hero}>
        <Container>
          <h1 className={`text-center ${styles.title}`}>{t('bounty_page_title')}</h1>
          <p className={`text-center ${styles.description}`}>{t('bounty_page_description')}</p>
        </Container>
      </section>

      <Container className="my-5 d-flex flex-column gap-4">
        <BountyView
          title={t('bounty_dashboard')}
          url="https://open-source-bazaar.feishu.cn/share/base/dashboard/shrcnt4EaAxn3zx9faRarERgEqf"
          icon="📊"
        />

        <Row className="g-4">
          <Col xs={12} lg={8}>
            <BountyView
              icon="📋"
              title={t('bounty_task_rank')}
              url="https://open-source-bazaar.feishu.cn/share/base/view/shrcnUVgb8E73UthaB2Tk4glnSb"
            />
          </Col>
          <Col xs={12} lg={4}>
            <BountyView
              icon="📝"
              title={t('bounty_task_submission')}
              url="https://open-source-bazaar.feishu.cn/share/base/form/shrcn2Ss97TSu3XgPi7mbZbrXLe"
            />
          </Col>
        </Row>

        <Row className="g-4">
          <Col xs={12} lg={8}>
            <BountyView
              icon="🏆"
              title={t('bounty_achievement_rank')}
              url="https://open-source-bazaar.feishu.cn/share/base/view/shrcne4IY9mYAfoo9a69oxyAdTb"
            />
          </Col>
          <Col xs={12} lg={4}>
            <BountyView
              icon="✅"
              title={t('bounty_achievement_submission')}
              url="https://open-source-bazaar.feishu.cn/share/base/form/shrcn7yHGIOnPNjdZck3eBaiMVc"
            />
          </Col>
        </Row>

        <BountyView
          icon="🪙"
          title={t('bounty_token_rank')}
          url="https://open-source-bazaar.feishu.cn/share/base/view/shrcn6QBgImHEjFH5qDf5tjmrzb"
        />

        <BountyView
          icon="🦸"
          title={t('bounty_hero_rank')}
          url="https://open-source-bazaar.feishu.cn/share/base/view/shrcnyrOkRfqSAjWEjCQ9T4OOwc"
        />

        <BountyView
          icon="💳"
          title={t('bounty_debt_rank')}
          url="https://open-source-bazaar.feishu.cn/share/base/view/shrcnImOzkBXW3okKp3nLskPMgd"
        />
      </Container>
    </>
  );
});

export default BountyPage;
