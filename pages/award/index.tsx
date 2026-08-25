import { observer } from 'mobx-react';
import { FC, useContext, useState } from 'react';
import { Badge, Button, ButtonGroup, Card, Col, Container, Row } from 'react-bootstrap';
import { Minute, Second } from 'web-utility';

import styles from '../../components/award/Award.module.less';
import { AWARD_VOTE_THRESHOLD, AwardCard, voteCountOf } from '../../components/award/AwardCard';
import { NominationForm } from '../../components/award/NominationForm';
import { PageHead } from '../../components/Layout/PageHead';
import { Award, AwardModel } from '../../models/Award';
import { I18nContext, I18nKey } from '../../models/Translation';
import { lark } from '../api/Lark/core';
import { skipBuilding } from '../api/SSG';

export const getStaticProps = skipBuilding<{ awards: Award[] }>(async () => {
  await lark.getAccessToken();

  const store = new AwardModel();
  store.client = lark.client;

  const awards = await store.getAll();

  return {
    props: JSON.parse(JSON.stringify({ awards })),
    revalidate: Minute / Second,
  };
});

type AwardFilter = 'all' | 'pending' | 'recognized';

const aboutItems: Array<{ icon: string; title: I18nKey; description: I18nKey }> = [
  { icon: '🌟', title: 'award_meaning', description: 'award_meaning_description' },
  { icon: '🎯', title: 'award_criteria', description: 'award_criteria_description' },
  { icon: '🏆', title: 'award_shared_value', description: 'award_shared_value_description' },
];

const ruleItems: Array<{ title: I18nKey; description: I18nKey }> = [
  { title: 'award_rule_nominate', description: 'award_rule_nominate_description' },
  { title: 'award_rule_vote', description: 'award_rule_vote_description' },
  { title: 'award_rule_establish', description: 'award_rule_establish_description' },
  { title: 'award_rule_trophy', description: 'award_rule_trophy_description' },
];

const faqItems: Array<{ question: I18nKey; answer: I18nKey }> = [
  { question: 'award_faq_who_question', answer: 'award_faq_who_answer' },
  { question: 'award_faq_video_question', answer: 'award_faq_video_answer' },
  { question: 'award_faq_cost_question', answer: 'award_faq_cost_answer' },
  { question: 'award_faq_multiple_question', answer: 'award_faq_multiple_answer' },
  { question: 'award_faq_delivery_question', answer: 'award_faq_delivery_answer' },
];

const AwardPage: FC<{ awards: Award[] }> = observer(({ awards }) => {
  const { t } = useContext(I18nContext),
    [filter, setFilter] = useState<AwardFilter>('all'),
    [showNominationForm, setShowNominationForm] = useState(false);

  const recognizedAwards = awards.filter(award => voteCountOf(award) >= AWARD_VOTE_THRESHOLD),
    totalVotes = awards.reduce((total, award) => total + voteCountOf(award), 0),
    filteredAwards = awards.filter(award => {
      const recognized = voteCountOf(award) >= AWARD_VOTE_THRESHOLD;

      if (filter === 'pending') return !recognized;
      if (filter === 'recognized') return recognized;

      return true;
    });

  const stats: Array<[number, I18nKey]> = [
    [awards.length, 'award_total_nominations'],
    [recognizedAwards.length, 'award_total_recognized'],
    [totalVotes, 'award_total_support'],
  ];

  const filterLabels: Record<AwardFilter, I18nKey> = {
    all: 'award_filter_all',
    pending: 'award_filter_pending',
    recognized: 'award_filter_recognized',
  };

  return (
    <>
      <PageHead title={t('open_collaborator_award')} />

      <header className={styles.hero}>
        <Container className={`${styles.heroContent} text-center`}>
          <h1 className={styles.heroTitle}>{t('award_hero_title')}</h1>
          <p className={styles.heroDescription}>{t('award_hero_description')}</p>
          <Button size="lg" variant="light" onClick={() => setShowNominationForm(true)}>
            {t('award_submit_nomination')}
          </Button>

          <Row className="mt-5 justify-content-center">
            {stats.map(([value, label]) => (
              <Col key={label} xs={4} md={3}>
                <div className={styles.statNumber}>{value}</div>
                <div>{t(label)}</div>
              </Col>
            ))}
          </Row>
        </Container>
      </header>

      <main>
        <section className={styles.section}>
          <Container>
            <h2 className={styles.sectionTitle}>{t('award_about_title')}</h2>
            <Row className="g-4">
              {aboutItems.map(({ icon, title, description }) => (
                <Col key={title} md={4}>
                  <Card className={`${styles.infoCard} h-100`} body>
                    <div className="mb-3 fs-1" aria-hidden="true">
                      {icon}
                    </div>
                    <Card.Title as="h3">{t(title)}</Card.Title>
                    <Card.Text>{t(description)}</Card.Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <section className={`${styles.section} ${styles.initiative}`}>
          <Container>
            <h2 className={styles.sectionTitle}>{t('award_initiative_title')}</h2>
            <Row className="align-items-center g-4">
              <Col md={6}>
                <div className={`${styles.videoWrapper} ${styles.initiativeVideo}`}>
                  <iframe
                    src="https://player.bilibili.com/player.html?bvid=BV1c44y1x7ij&page=1&high_quality=1&danmaku=0"
                    title={t('award_initiative_video_title')}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </Col>
              <Col md={6}>
                <h3>{t('award_initiative_question')}</h3>
                <p>{t('award_initiative_description')}</p>
                <Button variant="light" onClick={() => setShowNominationForm(true)}>
                  {t('award_submit_nomination')}
                </Button>
              </Col>
            </Row>
          </Container>
        </section>

        <section className={`${styles.section} ${styles.mutedSection}`}>
          <Container>
            <h2 className={styles.sectionTitle}>{t('award_rules_title')}</h2>
            <Row as="ol" className="list-unstyled g-4">
              {ruleItems.map(({ title, description }, index) => (
                <Col key={title} as="li" md={6} lg={3}>
                  <Card className={`${styles.ruleCard} h-100`} body>
                    <span className={styles.ruleNumber}>{index + 1}</span>
                    <Card.Title as="h3" className="h5">
                      {t(title)}
                    </Card.Title>
                    <Card.Text>{t(description)}</Card.Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {recognizedAwards.length > 0 && (
          <section className={styles.section}>
            <Container>
              <h2 className={styles.sectionTitle}>{t('award_recognized_list')}</h2>
              <Row className="g-4">
                {recognizedAwards.map(award => (
                  <Col key={award.id?.toString()} md={6}>
                    <Card className={`${styles.recipientCard} h-100`} body>
                      <Badge className="align-self-start mb-2" bg="success">
                        {award.awardName?.toString() || t('open_collaborator_award')}
                      </Badge>
                      <Card.Title as="h3">
                        {award.nomineeName?.toString() || t('award_unnamed_nominee')}
                      </Card.Title>
                      <Card.Text>
                        {voteCountOf(award)} {t('award_support_count')}
                      </Card.Text>
                      <Button
                        className="align-self-start"
                        href={`#award-${award.id}`}
                        variant="outline-primary"
                      >
                        {t('award_view_nomination')}
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        )}

        <section className={`${styles.section} ${styles.mutedSection}`}>
          <Container>
            <h2 className={styles.sectionTitle}>{t('award_nominations_title')}</h2>
            <ButtonGroup
              className="mb-4 d-flex justify-content-center gap-2"
              aria-label={t('award_filter')}
            >
              {(Object.keys(filterLabels) as AwardFilter[]).map(value => (
                <Button
                  key={value}
                  aria-pressed={filter === value}
                  variant={filter === value ? 'primary' : 'outline-secondary'}
                  onClick={() => setFilter(value)}
                >
                  {t(filterLabels[value])}
                </Button>
              ))}
            </ButtonGroup>

            {filteredAwards.length ? (
              <Row as="ol" className="list-unstyled g-4">
                {filteredAwards.map(award => (
                  <Col key={award.id?.toString()} as="li" lg={6}>
                    <AwardCard {...award} />
                  </Col>
                ))}
              </Row>
            ) : (
              <p className="py-5 text-center text-muted">{t('award_no_nominations')}</p>
            )}

            <div className="mt-5 text-center">
              <Button size="lg" onClick={() => setShowNominationForm(true)}>
                {t('award_submit_nomination')}
              </Button>
            </div>
          </Container>
        </section>

        <section className={styles.section}>
          <Container>
            <h2 className={styles.sectionTitle}>{t('award_faq_title')}</h2>
            <Row className="justify-content-center">
              <Col lg={8}>
                {faqItems.map(({ question, answer }) => (
                  <Card key={question} className={`${styles.faqCard} mb-3`} body>
                    <Card.Title as="h3" className="h5">
                      {t(question)}
                    </Card.Title>
                    <Card.Text>{t(answer)}</Card.Text>
                  </Card>
                ))}
              </Col>
            </Row>
          </Container>
        </section>
      </main>

      <NominationForm show={showNominationForm} onHide={() => setShowNominationForm(false)} />
    </>
  );
});

export default AwardPage;
