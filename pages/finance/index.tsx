import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { FC, useContext, useMemo, useState } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';

import styles from '../../components/Finance/Finance.module.less';
import { FundCard } from '../../components/Finance/FundCard';
import { PageHead } from '../../components/Layout/PageHead';
import {
  type FinanceLabelKey,
  INDEX_CATEGORY_LABEL_KEYS,
  INDEX_RISK_LABEL_KEYS,
} from '../../constants/finance';
import { IndexFundFilter, indexFundStore } from '../../models/Finance';
import { I18nContext } from '../../models/Translation';
import { IndexFundCategory, IndexRiskLevel } from '../../types/finance';

const categoryOptions: { labelKey: FinanceLabelKey; value?: IndexFundCategory }[] = [
  { labelKey: 'finance_all', value: undefined },
  { labelKey: 'index_category_broad', value: 'broad' },
  { labelKey: 'index_category_sector', value: 'sector' },
  { labelKey: 'index_category_theme', value: 'theme' },
];

const riskOptions: {
  labelKey: FinanceLabelKey;
  value?: IndexRiskLevel;
  descriptionKey: FinanceLabelKey;
}[] = [
  { labelKey: 'finance_all', value: undefined, descriptionKey: 'finance_filter_risk_all_desc' },
  {
    labelKey: 'index_risk_conservative',
    value: 'conservative',
    descriptionKey: 'finance_filter_risk_conservative_desc',
  },
  {
    labelKey: 'index_risk_balanced',
    value: 'balanced',
    descriptionKey: 'finance_filter_risk_balanced_desc',
  },
  {
    labelKey: 'index_risk_aggressive',
    value: 'aggressive',
    descriptionKey: 'finance_filter_risk_aggressive_desc',
  },
];

const FinanceLandingPage: FC = observer(() => {
  const i18n = useContext(I18nContext);
  const { t } = i18n;
  const [category, setCategory] = useState<IndexFundCategory>();
  const [riskLevel, setRiskLevel] = useState<IndexRiskLevel>();

  const filterSummary = useMemo(() => {
    const categoryText = category
      ? `${t(INDEX_CATEGORY_LABEL_KEYS[category])}${t('finance_filter_category_suffix')}`
      : t('finance_filter_category_all');
    const riskText = riskLevel
      ? `${t(INDEX_RISK_LABEL_KEYS[riskLevel])}${t('finance_filter_risk_suffix')}`
      : t('finance_filter_risk_all');

    return `${categoryText} · ${riskText}`;
  }, [category, riskLevel, t]);

  const resetFilters = () => {
    setCategory(undefined);
    setRiskLevel(undefined);
  };

  const filter: IndexFundFilter = { category, riskLevel };

  return (
    <Container className={styles.financePage}>
      <PageHead title={t('finance_page_title')} description={t('finance_page_description')} />

      <Row as="header" className={`${styles.hero} py-5 mt-4 mb-5 align-items-center gy-4`}>
        <Col md={6}>
          <Badge bg="dark" className={styles.heroBadge}>
            {t('beta')}
          </Badge>
          <h1 className="display-5 fw-bold mt-3 mb-3">{t('finance_hero_title')}</h1>
          <p className="text-muted fs-5">{t('finance_hero_intro')}</p>
          <ul className="list-unstyled d-flex flex-wrap gap-3">
            <li className={styles.heroChip}>{t('finance_hero_chip_akshare_data')}</li>
            <li className={styles.heroChip}>{t('finance_hero_chip_realtime_backtest')}</li>
            <li className={styles.heroChip}>{t('finance_hero_chip_risk_layers')}</li>
          </ul>
          <div className="d-flex flex-wrap gap-3">
            <Button size="lg" variant="primary" href="#fund-list">
              {t('finance_hero_cta_pick')}
            </Button>
            <Button size="lg" variant="outline-secondary" href="#education">
              {t('finance_hero_cta_guide')}
            </Button>
          </div>
        </Col>
        <Col md={6} className={styles.heroStats}>
          <ul className={styles.heroStats}>
            <li className={styles.heroStatCard}>
              <p className="text-muted mb-2">{t('finance_hero_stat_coverage_label')}</p>
              <strong className="display-6">{Math.max(indexFundStore.totalCount || 0, 8)}+</strong>
              <small className="text-muted">{t('finance_hero_stat_coverage_sub')}</small>
            </li>
            <li className={styles.heroStatCard}>
              <p className="text-muted mb-2">{t('finance_hero_stat_refresh_label')}</p>
              <strong className="display-6">{t('finance_hero_stat_refresh_value')}</strong>
              <small className="text-muted">{t('finance_hero_stat_refresh_sub')}</small>
            </li>
            <li className={styles.heroStatCard}>
              <p className="text-muted mb-2">{t('finance_hero_stat_risk_label')}</p>
              <strong className="display-6">{t('finance_hero_stat_risk_value')}</strong>
              <small className="text-muted">{t('finance_hero_stat_risk_sub')}</small>
            </li>
          </ul>
        </Col>
      </Row>

      <section id="filter" className={`${styles.filterPanel} mb-5`}>
        <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <h2 className="h4 mb-1">{t('finance_filter_title')}</h2>
            <p className="text-muted mb-0">
              {t('finance_filter_summary_prefix')}
              {filterSummary}
            </p>
          </div>
          <Button variant="link" className="p-0" onClick={resetFilters}>
            {t('finance_filter_reset')}
          </Button>
        </header>

        <div className="d-flex flex-column gap-4">
          <div>
            <p className="text-muted mb-2">{t('finance_filter_category_label')}</p>
            <div className={styles.segmentedControl}>
              {categoryOptions.map(({ labelKey, value }) => {
                const active = value === undefined ? !category : category === value;

                return (
                  <button
                    key={labelKey}
                    type="button"
                    className={`${styles.segmentedButton} ${active ? styles.segmentedButtonActive : ''}`}
                    onClick={() =>
                      setCategory(current =>
                        value === undefined ? undefined : current === value ? undefined : value,
                      )
                    }
                  >
                    {t(labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-muted mb-2">{t('finance_filter_risk_label')}</p>
            <div className={styles.segmentedControl}>
              {riskOptions.map(({ labelKey, value, descriptionKey }) => {
                const active = value === undefined ? !riskLevel : riskLevel === value;

                return (
                  <button
                    key={labelKey}
                    type="button"
                    className={`${styles.segmentedButton} ${active ? styles.segmentedButtonActive : ''}`}
                    onClick={() =>
                      setRiskLevel(current =>
                        value === undefined ? undefined : current === value ? undefined : value,
                      )
                    }
                  >
                    <span>{t(labelKey)}</span>
                    <small className="text-muted d-block">{t(descriptionKey)}</small>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="fund-list" className={styles.listSection}>
        <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h2 className="h3 mb-1">{t('finance_list_title')}</h2>
            <p className="text-muted mb-0">
              {t('finance_list_subtitle_prefix')}
              {filterSummary}
              {t('finance_list_subtitle_suffix')}
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Button variant="outline-secondary" disabled>
              {t('finance_list_export_soon')}
            </Button>
            <Button variant="outline-primary" href="#education">
              {t('finance_list_strategy_suggestion')}
            </Button>
          </div>
        </header>

        {indexFundStore.downloading > 0 && <Loading />}

        <ScrollList
          store={indexFundStore}
          translator={i18n}
          filter={filter}
          renderList={funds =>
            funds.length ? (
              <Row xs={1} md={2} className="g-4">
                {funds.map(fund => (
                  <Col key={fund.symbol}>
                    <FundCard {...fund} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className={styles.emptyState}>
                <p className="mb-3 fw-semibold">{t('finance_empty_title')}</p>
                <p className="text-muted mb-4">{t('finance_empty_subtitle')}</p>
                <Button variant="primary" onClick={resetFilters}>
                  {t('finance_empty_reset_button')}
                </Button>
              </div>
            )
          }
        />
      </section>

      <section id="education" className={`${styles.educationSection} my-5`}>
        <Row className="g-4">
          <Col md={6}>
            <div className={styles.educationCard}>
              <h3 className="h5">{t('finance_edu_title')}</h3>
              <ul className="mb-0">
                <li>{t('finance_edu_point_1')}</li>
                <li>{t('finance_edu_point_2')}</li>
                <li>{t('finance_edu_point_3')}</li>
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div className={styles.educationCard}>
              <h3 className="h5">{t('finance_edu_next_steps')}</h3>
              <ol className="mb-0">
                <li>{t('finance_edu_next_1')}</li>
                <li>{t('finance_edu_next_2')}</li>
                <li>{t('finance_edu_next_3')}</li>
              </ol>
            </div>
          </Col>
        </Row>
      </section>
    </Container>
  );
});

export default FinanceLandingPage;
