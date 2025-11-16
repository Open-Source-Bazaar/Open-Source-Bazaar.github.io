import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { FC, useContext, useMemo, useState } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';

import { FundCard } from '../../components/Finance/FundCard';
import { PageHead } from '../../components/Layout/PageHead';
import { INDEX_CATEGORY_LABELS, INDEX_RISK_LABELS } from '../../constants/finance';
import { IndexFundFilter, indexFundStore } from '../../models/Finance';
import { I18nContext } from '../../models/Translation';
import styles from '../../styles/Finance.module.scss';
import { IndexFundCategory, IndexRiskLevel } from '../../types/finance';

const categoryOptions: { label: string; value?: IndexFundCategory }[] = [
  { label: '全部', value: undefined },
  { label: '宽基', value: 'broad' },
  { label: '行业', value: 'sector' },
  { label: '主题', value: 'theme' },
];

const riskOptions: { label: string; value?: IndexRiskLevel; description: string }[] = [
  { label: '全部', value: undefined, description: '不限风险偏好' },
  { label: '保守', value: 'conservative', description: '波动小于 12%' },
  { label: '稳健', value: 'balanced', description: '波动 12%-20%' },
  { label: '进取', value: 'aggressive', description: '波动大于 20%' },
];

const FinanceLandingPage: FC = observer(() => {
  const i18n = useContext(I18nContext);
  const { t } = i18n;
  const [category, setCategory] = useState<IndexFundCategory>();
  const [riskLevel, setRiskLevel] = useState<IndexRiskLevel>();

  const filterSummary = useMemo(() => {
    const categoryText = category ? `${INDEX_CATEGORY_LABELS[category]}指数` : '全部类别';
    const riskText = riskLevel ? `${INDEX_RISK_LABELS[riskLevel]}风险` : '全部风险';

    return `${categoryText} · ${riskText}`;
  }, [category, riskLevel]);

  const resetFilters = () => {
    setCategory(undefined);
    setRiskLevel(undefined);
  };

  const filter: IndexFundFilter = { category, riskLevel };

  return (
    <Container className={styles.financePage}>
      <PageHead
        title="指数基金理财精选"
        description="面向小白用户的国内指数基金精选页面，基于 AKShare 数据实时刷新。"
      />

      <section className={`${styles.hero} py-5 mt-4 mb-5`}>
        <Row className="align-items-center gy-4">
          <Col md={6}>
            <Badge bg="dark" className={styles.heroBadge}>
              Beta
            </Badge>
            <h1 className="display-5 fw-bold mt-3 mb-3">指数基金理财 · 国内优选</h1>
            <p className="text-muted fs-5">
              基于 AKShare
              指数数据构建的国内指数基金精选，帮助小白用户快速理解风险、收益与波动，挑选适合自己的定投组合。
            </p>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <span className={styles.heroChip}>AKShare 指数数据</span>
              <span className={styles.heroChip}>实时行情 & 历史回测</span>
              <span className={styles.heroChip}>风险等级分层</span>
            </div>
            <div className="d-flex flex-wrap gap-3">
              <Button size="lg" variant="primary" href="#fund-list">
                开始挑选
              </Button>
              <Button size="lg" variant="outline-secondary" href="#education">
                理财小白指南
              </Button>
            </div>
          </Col>
          <Col md={6}>
            <div className={styles.heroStats}>
              <div className={styles.heroStatCard}>
                <p className="text-muted mb-2">覆盖指数</p>
                <strong className="display-6">
                  {Math.max(indexFundStore.totalCount || 0, 8)}+
                </strong>
                <small className="text-muted">宽基 + 行业核心指数</small>
              </div>
              <div className={styles.heroStatCard}>
                <p className="text-muted mb-2">数据刷新</p>
                <strong className="display-6">60s</strong>
                <small className="text-muted">实时行情自动更新</small>
              </div>
              <div className={styles.heroStatCard}>
                <p className="text-muted mb-2">风险提示</p>
                <strong className="display-6">3</strong>
                <small className="text-muted">保守 · 稳健 · 进取</small>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      <section id="filter" className={`${styles.filterPanel} mb-5`}>
        <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <h2 className="h4 mb-1">快速筛选</h2>
            <p className="text-muted mb-0">
              根据风险与类别筛选适合的指数基金，所选条件：{filterSummary}
            </p>
          </div>
          <Button variant="link" className="p-0" onClick={resetFilters}>
            清空条件
          </Button>
        </header>

        <div className="d-flex flex-column gap-4">
          <div>
            <p className="text-muted mb-2">指数类别</p>
            <div className={styles.segmentedControl}>
              {categoryOptions.map(({ label, value }) => {
                const active = value === undefined ? !category : category === value;

                return (
                  <button
                    key={label}
                    type="button"
                    className={`${styles.segmentedButton} ${active ? styles.segmentedButtonActive : ''}`}
                    onClick={() =>
                      setCategory(current =>
                        value === undefined ? undefined : current === value ? undefined : value,
                      )
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-muted mb-2">风险等级</p>
            <div className={styles.segmentedControl}>
              {riskOptions.map(({ label, value, description }) => {
                const active = value === undefined ? !riskLevel : riskLevel === value;

                return (
                  <button
                    key={label}
                    type="button"
                    className={`${styles.segmentedButton} ${active ? styles.segmentedButtonActive : ''}`}
                    onClick={() =>
                      setRiskLevel(current =>
                        value === undefined ? undefined : current === value ? undefined : value,
                      )
                    }
                  >
                    <span>{label}</span>
                    <small className="text-muted d-block">{description}</small>
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
            <h2 className="h3 mb-1">指数基金精选</h2>
            <p className="text-muted mb-0">展示指数：{filterSummary}，数据源 AkShare</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Button variant="outline-secondary" disabled>
              数据导出（即将上线）
            </Button>
            <Button variant="outline-primary" href="#education">
              策略组合建议
            </Button>
          </div>
        </header>

        {indexFundStore.downloading > 0 && (
          <div className="text-center my-4">
            <Loading />
          </div>
        )}

        <ScrollList
          store={indexFundStore}
          translator={i18n}
          filter={filter}
          renderList={funds =>
            funds.length ? (
              <Row xs={1} md={2} className="g-4">
                {funds.map(fund => (
                  <Col key={fund.symbol}>
                    <FundCard data={fund} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className={styles.emptyState}>
                <p className="mb-3 fw-semibold">暂无符合条件的指数</p>
                <p className="text-muted mb-4">尝试放宽筛选条件，或稍后再试。</p>
                <Button variant="primary" onClick={resetFilters}>
                  重置筛选
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
              <h3 className="h5">指数基金三句话</h3>
              <ul className="mb-0">
                <li>跟踪一篮子股票，成本低、透明度高。</li>
                <li>长期定投平滑风险，优先关注宽基指数。</li>
                <li>用数据衡量风险：波动、回撤、估值百分位。</li>
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div className={styles.educationCard}>
              <h3 className="h5">下一步</h3>
              <ol className="mb-0">
                <li>挑选 2-3 支指数，加入收藏/关注列表。</li>
                <li>了解对应的 ETF 或联接基金，关注费率与规模。</li>
                <li>设定定投计划并持续跟踪估值、回撤。</li>
              </ol>
            </div>
          </Col>
        </Row>
      </section>
    </Container>
  );
});

export default FinanceLandingPage;
