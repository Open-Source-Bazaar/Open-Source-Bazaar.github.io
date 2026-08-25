import { observer } from 'mobx-react';
import { FC, useContext, useState } from 'react';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';

import { PageHead } from '../components/Layout/PageHead';
import { SectionTitle } from '../components/Layout/SectionTitle';
import {
  categoryMeta,
  getCategoryStats,
  getProvinces,
  RescueCategory,
  rescueRecords,
  RescueRecord,
} from '../models/Wuhan2020';
import { I18nContext } from '../models/Translation';
import styles from '../styles/Wuhan2020.module.less';

const categoryColor: Record<RescueCategory, string> = {
  hospital: '#c62828',
  hotel: '#1565c0',
  logistics: '#2e7d32',
  factory: '#e65100',
  donation: '#6a1b9a',
  consulting: '#00838f',
};

const RecordCard: FC<{ record: RescueRecord }> = ({ record }) => {
  const { t } = useContext(I18nContext);

  return (
    <Card className={`h-100 ${styles.recordCard}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title as="h3" className="fs-6 mb-0">
            {record.name}
          </Card.Title>
          {record.verified && (
            <Badge className={styles.badgeVerified}>{t('wuhan2020_verified')}</Badge>
          )}
        </div>

        <Badge
          className={`${styles.categoryBadge} mb-2`}
          style={{ background: categoryColor[record.category] }}
        >
          {t(`wuhan2020_cat_${record.category}`)}
        </Badge>

        <Card.Text className={styles.description}>{record.description}</Card.Text>

        <div className="d-flex flex-column gap-1 mt-3">
          <div className={styles.infoItem}>
            <span>📍</span>
            <span>
              {record.province}
              {record.city !== record.province ? ` · ${record.city}` : ''}
              {record.address ? ` · ${record.address}` : ''}
            </span>
          </div>
          {record.phone && (
            <div className={styles.infoItem}>
              <span>📞</span>
              <a href={`tel:${record.phone}`}>{record.phone}</a>
            </div>
          )}
          {record.url && (
            <div className={styles.infoItem}>
              <span>🔗</span>
              <a href={record.url} target="_blank" rel="noopener noreferrer">
                {record.url}
              </a>
            </div>
          )}
          {record.createdAt && (
            <div className={styles.infoItem}>
              <span>📅</span>
              <span>{record.createdAt}</span>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

const categoryIcons: Record<RescueCategory, string> = {
  hospital: '🏥',
  hotel: '🏨',
  logistics: '🚚',
  factory: '🏭',
  donation: '💝',
  consulting: '🩺',
};

const Wuhan2020Page: FC = observer(() => {
  const { t } = useContext(I18nContext);
  const [activeCategory, setActiveCategory] = useState<RescueCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = getCategoryStats();
  const provinces = getProvinces();

  const filteredRecords = rescueRecords.filter(r => {
    const matchCategory = activeCategory ? r.category === activeCategory : true;
    const matchSearch = searchTerm
      ? r.name.includes(searchTerm) ||
        r.description.includes(searchTerm) ||
        r.city.includes(searchTerm) ||
        r.province.includes(searchTerm)
      : true;
    return matchCategory && matchSearch;
  });

  return (
    <>
      <PageHead
        title={t('wuhan2020_title')}
        description={t('wuhan2020_description')}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <Container className="position-relative text-center">
          <h1 className={styles.title}>{t('wuhan2020_title')}</h1>
          <p className={styles.subtitle}>{t('wuhan2020_description')}</p>

          <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
            <span className={styles.metaBadge}>📅 2020.01 — 2020.04</span>
            <span className={styles.metaBadge}>📊 {rescueRecords.length} {t('wuhan2020_records')}</span>
            <span className={styles.metaBadge}>🌍 {provinces.length} {t('wuhan2020_regions')}</span>
          </div>
        </Container>
      </section>

      {/* Category Stats */}
      <Container>
        <Row className={`g-3 ${styles.statsRow} mb-5`}>
          {stats.map(({ key, icon, count }) => (
            <Col xs={6} sm={4} md={2} key={key}>
              <Card
                className={`text-center p-3 ${styles.statCard} ${activeCategory === key ? styles.active : ''}`}
                onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              >
                <div className={styles.statIcon}>{icon}</div>
                <div className={styles.statCount}>{count}</div>
                <div className={styles.statLabel}>{t(`wuhan2020_cat_${key}`)}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Records */}
      <Container className="mb-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <SectionTitle count={filteredRecords.length}>
            {activeCategory
              ? `${categoryIcons[activeCategory]} ${t(`wuhan2020_cat_${activeCategory}`)}`
              : t('wuhan2020_all_records')}
          </SectionTitle>

          {/* Search */}
          <div className={styles.filterBar + ' p-2 d-flex align-items-center gap-2'}>
            <span>🔍</span>
            <input
              type="text"
              className="form-control form-control-sm border-0 bg-transparent"
              placeholder={t('wuhan2020_search_placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ maxWidth: 220 }}
            />
            {searchTerm && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter buttons */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            className={`btn btn-sm ${styles.filterBtn} ${!activeCategory ? styles.active : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            {t('wuhan2020_all')}
          </button>
          {categoryMeta.map(({ key, icon }) => (
            <button
              key={key}
              className={`btn btn-sm ${styles.filterBtn} ${activeCategory === key ? styles.active : ''}`}
              onClick={() => setActiveCategory(activeCategory === key ? null : key)}
            >
              {icon} {t(`wuhan2020_cat_${key}`)}
            </button>
          ))}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="fs-5">📭 {t('wuhan2020_no_results')}</p>
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setActiveCategory(null);
                setSearchTerm('');
              }}
            >
              {t('wuhan2020_reset')}
            </button>
          </div>
        ) : (
          <Row xs={1} sm={2} lg={3} className="g-4">
            {filteredRecords.map(record => (
              <Col key={record.id}>
                <RecordCard record={record} />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Timeline / Data Source */}
      <section className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">{t('wuhan2020_timeline_title')}</h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className={`${styles.timeline} ps-4`}>
                {[
                  { date: '2020-01-20', event: t('wuhan2020_timeline_1') },
                  { date: '2020-01-23', event: t('wuhan2020_timeline_2') },
                  { date: '2020-01-25', event: t('wuhan2020_timeline_3') },
                  { date: '2020-02-02', event: t('wuhan2020_timeline_4') },
                  { date: '2020-02-08', event: t('wuhan2020_timeline_5') },
                  { date: '2020-04-08', event: t('wuhan2020_timeline_6') },
                ].map(({ date, event }) => (
                  <div key={date} className="d-flex gap-3 mb-4">
                    <div className={styles.timelineDot + ' flex-shrink-0 mt-1'} />
                    <div>
                      <strong className="text-primary">{date}</strong>
                      <p className="mb-0 text-muted">{event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <p className={styles.sourceNote}>
              {t('wuhan2020_source_note')}{' '}
              <a
                href="https://github.com/nicedoc/wuhan2020"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/nicedoc/wuhan2020
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
});

export default Wuhan2020Page;
