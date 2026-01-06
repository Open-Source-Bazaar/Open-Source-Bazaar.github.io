import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Card, Col, Container, Ratio, Row } from 'react-bootstrap';

import { PageHead } from '../components/Layout/PageHead';
import { I18nContext } from '../models/Translation';
import styles from '../styles/Bounty.module.less';

interface BountyViewProps {
  title: string;
  url: string;
  icon: string;
  colspan?: number;
}

const BountyView: FC<BountyViewProps> = ({ title, url, icon, colspan = 6 }) => (
  <Col md={colspan}>
    <Card className={styles.bountyCard} body>
      <Card.Title as="h2" className={`fs-5 ${styles.cardTitle}`}>
        {icon} {title}
      </Card.Title>
      <Ratio aspectRatio="4x3" className={styles.iframeContainer}>
        <iframe
          src={url}
          className={styles.bountyIframe}
          title={title}
          allow="clipboard-read; clipboard-write"
        />
      </Ratio>
    </Card>
  </Col>
);

const BountyPage: FC = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <>
      <PageHead title={t('bounty_page_title')} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <Container>
          <h1 className={`text-center ${styles.title}`}>{t('bounty_page_title')}</h1>
          <p className={`text-center ${styles.description}`}>{t('bounty_page_description')}</p>
        </Container>
      </section>

      <Container className="my-5">
        {/* Dashboard - full width */}
        <Row className="g-4 mb-4">
          <BountyView
            title={t('bounty_dashboard')}
            url="https://open-source-bazaar.feishu.cn/share/base/dashboard/shrcnt4EaAxn3zx9faRarERgEqf"
            icon="📊"
            colspan={12}
          />
        </Row>

        {/* Task Rank and Submission Form - same row */}
        <Row className="g-4 mb-4">
          <BountyView
            title={t('bounty_task_rank')}
            url="https://open-source-bazaar.feishu.cn/share/base/view/shrcnUVgb8E73UthaB2Tk4glnSb"
            icon="📋"
          />
          <BountyView
            title={t('bounty_task_submission')}
            url="https://open-source-bazaar.feishu.cn/share/base/form/shrcn2Ss97TSu3XgPi7mbZbrXLe"
            icon="📝"
          />
        </Row>

        {/* Achievement Rank and Submission Form - same row */}
        <Row className="g-4 mb-4">
          <BountyView
            title={t('bounty_achievement_rank')}
            url="https://open-source-bazaar.feishu.cn/share/base/view/shrcne4IY9mYAfoo9a69oxyAdTb"
            icon="🏆"
          />
          <BountyView
            title={t('bounty_achievement_submission')}
            url="https://open-source-bazaar.feishu.cn/share/base/form/shrcn7yHGIOnPNjdZck3eBaiMVc"
            icon="✅"
          />
        </Row>

        {/* Token Rank - full width */}
        <Row className="g-4 mb-4">
          <BountyView
            title={t('bounty_token_rank')}
            url="https://open-source-bazaar.feishu.cn/share/base/view/shrcn6QBgImHEjFH5qDf5tjmrzb"
            icon="🪙"
            colspan={12}
          />
        </Row>

        {/* Hero Rank - full width */}
        <Row className="g-4 mb-4">
          <BountyView
            title={t('bounty_hero_rank')}
            url="https://open-source-bazaar.feishu.cn/share/base/view/shrcnyrOkRfqSAjWEjCQ9T4OOwc"
            icon="🦸"
            colspan={12}
          />
        </Row>

        {/* Debt Rank - full width */}
        <Row className="g-4 mb-4">
          <BountyView
            title={t('bounty_debt_rank')}
            url="https://open-source-bazaar.feishu.cn/share/base/view/shrcnImOzkBXW3okKp3nLskPMgd"
            icon="💳"
            colspan={12}
          />
        </Row>
      </Container>
    </>
  );
});

export default BountyPage;
