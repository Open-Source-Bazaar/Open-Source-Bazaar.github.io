import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

import { PageHead } from '../components/Layout/PageHead';
import { I18nContext } from '../models/Translation';
import styles from '../styles/Bounty.module.less';

interface BountyViewProps {
  title: string;
  url: string;
  icon: string;
}

const BountyView: FC<BountyViewProps> = ({ title, url, icon }) => (
  <Col md={6} lg={4}>
    <Card className={styles.bountyCard}>
      <Card.Body>
        <h5 className={styles.cardTitle}>
          {icon} {title}
        </h5>
        <div className={styles.iframeContainer}>
          <iframe
            src={url}
            className={styles.bountyIframe}
            title={title}
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </Card.Body>
    </Card>
  </Col>
);

const BountyPage: FC = observer(() => {
  const { t } = useContext(I18nContext);

  const bountyViews: BountyViewProps[] = [
    {
      title: t('bounty_dashboard'),
      url: 'https://open-source-bazaar.feishu.cn/share/base/dashboard/shrcnt4EaAxn3zx9faRarERgEqf',
      icon: '📊',
    },
    {
      title: t('bounty_token_leaderboard'),
      url: 'https://open-source-bazaar.feishu.cn/share/base/view/shrcn6QBgImHEjFH5qDf5tjmrzb',
      icon: '🪙',
    },
    {
      title: t('bounty_task_leaderboard'),
      url: 'https://open-source-bazaar.feishu.cn/share/base/view/shrcnUVgb8E73UthaB2Tk4glnSb',
      icon: '📋',
    },
    {
      title: t('bounty_task_submission'),
      url: 'https://open-source-bazaar.feishu.cn/share/base/form/shrcn2Ss97TSu3XgPi7mbZbrXLe',
      icon: '📝',
    },
    {
      title: t('bounty_achievement_leaderboard'),
      url: 'https://open-source-bazaar.feishu.cn/share/base/view/shrcne4IY9mYAfoo9a69oxyAdTb',
      icon: '🏆',
    },
    {
      title: t('bounty_achievement_submission'),
      url: 'https://open-source-bazaar.feishu.cn/share/base/form/shrcn7yHGIOnPNjdZck3eBaiMVc',
      icon: '✅',
    },
    {
      title: t('bounty_hero_leaderboard'),
      url: 'https://open-source-bazaar.feishu.cn/share/base/view/shrcnyrOkRfqSAjWEjCQ9T4OOwc',
      icon: '🦸',
    },
    {
      title: t('bounty_debt_leaderboard'),
      url: 'https://open-source-bazaar.feishu.cn/share/base/view/shrcnImOzkBXW3okKp3nLskPMgd',
      icon: '💳',
    },
  ];

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
        <Row className="g-4">
          {bountyViews.map(view => (
            <BountyView key={view.url} {...view} />
          ))}
        </Row>
      </Container>
    </>
  );
});

export default BountyPage;
