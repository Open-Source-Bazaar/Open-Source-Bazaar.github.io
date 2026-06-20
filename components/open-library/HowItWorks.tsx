import Link from 'next/link';
import { observer } from 'mobx-react';
import { CSSProperties, FC, useContext } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import { I18nContext } from '../../models/Translation';
import { ContentContainer } from './Layout';
import styles from './HowItWorks.module.less';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  steps?: Step[];
  showLearnMore?: boolean;
  learnMoreLink?: string;
}

const HowItWorks: FC<HowItWorksProps> = observer(({ title, subtitle, steps, showLearnMore = true, learnMoreLink = '/open-library/how-to-borrow' }) => {
  const { t } = useContext(I18nContext);
  const resolvedTitle = title ?? t('how_it_works');
  const resolvedSubtitle = subtitle ?? t('how_it_works_description');
  const resolvedSteps: Step[] = steps ?? [
    { id: 1, title: t('step_1_find_book'), description: t('step_1_description'), icon: '�', color: '#6f42c1' },
    { id: 2, title: t('step_2_apply'), description: t('step_2_description'), icon: '📄', color: '#0d6efd' },
    { id: 3, title: t('step_3_receive'), description: t('step_3_description'), icon: '↔️', color: '#fd7e14' },
  ];

  return (
  <section className="py-5 bg-white">
    <ContentContainer>
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold text-dark mb-3 position-relative">
          {resolvedTitle}
          <div className="position-absolute start-50 translate-middle-x mt-2">
            <div className={`bg-primary rounded-pill ${styles.sectionTitleMarker}`} />
          </div>
        </h2>
        <p className={`lead text-muted mx-auto ${styles.subtitle}`}>{resolvedSubtitle}</p>
      </div>

      <Row className="g-4">
        {resolvedSteps.map((step, index) => (
          <Col key={step.id} md={6} lg={3}>
            <div className="text-center p-3">
              <div
                className={`position-relative mb-3 d-flex justify-content-center ${styles.stepIconWrap}`}
              >
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center text-white fs-4 shadow position-relative ${styles.stepIcon}`}
                  style={{ '--step-color': step.color } as CSSProperties}
                >
                  {step.icon}
                </div>
                <span
                  className={`position-absolute bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold small ${styles.stepNumber}`}
                >
                  {step.id}
                </span>
                {/* 连接线仅在大屏幕显示且不是最后一个 */}
                {index < resolvedSteps.length - 1 && (
                  <div
                    className={`position-absolute bg-secondary d-none d-lg-block ${styles.connector}`}
                  >
                    <div className={`position-absolute ${styles.connectorArrow}`} />
                  </div>
                )}
              </div>
              <h3 className="h5 fw-semibold text-dark mb-3">{step.title}</h3>
              <p className="text-muted lh-base">{step.description}</p>
            </div>
          </Col>
        ))}
      </Row>

      {showLearnMore && (
        <div className="text-center mt-5">
          <Link href={learnMoreLink} passHref legacyBehavior>
            <Button
              variant="outline-primary"
              size="lg"
              as="a"
              className="rounded-pill px-4 fw-semibold"
            >
              ℹ️ {t('learn_more_details')} →
            </Button>
          </Link>
        </div>
      )}
    </ContentContainer>
  </section>
  );
});

export default HowItWorks;
