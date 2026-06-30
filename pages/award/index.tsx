import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
const ALLOWED_EMBED_HOSTS = new Set([
  'player.bilibili.com',
  'www.youtube.com',
  'www.youtube-nocookie.com',
]);

const getSafeEmbedUrl = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value) return null;
  try {
    const url = new URL(value);
    return ALLOWED_EMBED_HOSTS.has(url.hostname) ? url.toString() : null;
  } catch { return null; }
};

import { PageHead } from '../../components/Layout/PageHead';
import { SectionTitle } from '../../components/Layout/SectionTitle';
import { Award, AwardModel } from '../../models/Award';
import { I18nContext } from '../../models/Translation';

export const getServerSideProps = compose(cache(), errorLogger, async () => {
  const awards = await new AwardModel().getAll();
  return { props: { awards } };
});

const NominationCard: FC<{ award: Award; index: number }> = observer(({ award, index }) => {
  const { t } = useContext(I18nContext);
  const name = (award.nomineeName ?? award.awardName ?? '') as string;
  const desc = (award.nomineeDesc ?? award.reason ?? '') as string;
  const nominator = (award.nominator ?? '') as string;
  const videoUrl = getSafeEmbedUrl(award.videoUrl) ?? '';
  const votes = (award.votes ?? 0) as number;

  return (
    <Card className="h-100 shadow-sm border-0">
      {videoUrl && (
        <div className="ratio ratio-16x9">
          <iframe
            src=loading="lazy" {videoUrl}
            title={name}
            allowFullScreen
            className="rounded-top"
          />
        </div>
      )}
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg="primary" className="me-2">#{index + 1}</Badge>
          {votes > 0 && (
            <Badge bg="warning" text="dark">
              {votes} {t('votes')}
            </Badge>
          )}
        </div>
        <Card.Title className="fs-5">{name}</Card.Title>
        {desc && (
          <Card.Text className="text-muted small mt-2" style={{ maxHeight: 80, overflow: 'hidden' }}>
            {desc}
          </Card.Text>
        )}
        {nominator && (
          <div className="mt-2 small">
            <span className="text-muted">{t('nominated_by')}: </span>
            <span className="fw-medium">{nominator}</span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
});

const AwardPage: FC<{ awards: Award[] }> = observer(({ awards }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-4">
      <PageHead
        title={t('open_collaborator_award')}
        description={t('award_page_description')}
      />

      {/* Hero Section */}
      <section className="text-center py-5 mb-4 bg-light rounded-3">
        <h1 className="display-4 fw-bold mb-3">{t('open_collaborator_award')}</h1>
        <p className="lead text-muted mb-4">{t('award_page_description')}</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <a href="/article/open-collaborator-award" className="btn btn-outline-primary">
            {t('learn_more')}
          </a>
          <a href="#nominations" className="btn btn-primary">
            {t('view_nominations')}
          </a>
        </div>
      </section>

      {/* Video Intro */}
      <section className="mb-5">
        <SectionTitle>{t('award_intro_video')}</SectionTitle>
        <div className="ratio ratio-16x9 border rounded overflow-hidden shadow-sm">
          <iframe
            src=loading="lazy" "//player.bilibili.com/player.html?aid=978564817&bvid=BV1c44y1x7ij&cid=494424932&page=1&high_quality=1&danmaku=0"
            title={t('open_collaborator_award') as string}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </section>

      {/* Awards List */}
      <section id="nominations" className="mb-5">
        <SectionTitle count={awards.length}>{t('award_nominations')}</SectionTitle>
        {awards.length > 0 ? (
          <Row className="g-4" xs={1} sm={2} lg={3}>
            {awards.map((award, index) => (
              <Col key={index}>
                <NominationCard award={award} index={index} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5 text-muted">
            <p className="fs-5">{t('no_nominations_yet')}</p>
            <p>{t('nomination_coming_soon')}</p>
          </div>
        )}
      </section>

      {/* How to Nominate */}
      <section className="mb-5 bg-light rounded-3 p-4 p-md-5">
        <h3 className="mb-4">{t('how_to_nominate')}</h3>
        <Row className="g-4">
          {[1, 2, 3, 4].map((step) => (
            <Col key={step} md={3} sm={6}>
              <div className="text-center">
                <div
                  className="d-inline-flex justify-content-center align-items-center rounded-circle bg-primary text-white mb-3"
                  style={{ width: 48, height: 48, fontSize: 20 }}
                >
                  {step}
                </div>
                <h5>{t('nomination_step' + step + '_title' as any)}</h5>
                <p className="text-muted small">{t('nomination_step' + step + '_desc' as any)}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Award Process / About */}
      <section className="mb-5">
        <h3 className="mb-4">{t('about_award')}</h3>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <p>{t('award_about_text')}</p>
            <div className="d-flex gap-3 mt-4">
              <a href="/article/open-collaborator-award" className="btn btn-outline-primary">
                {t('read_full_details')}
              </a>
            </div>
          </Card.Body>
        </Card>
      </section>
    </Container>
  );
});

export default AwardPage;