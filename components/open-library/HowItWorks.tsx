import { Button, Col, Container, Row } from 'idea-react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { CSSProperties, FC, useContext } from 'react';

import { I18nContext } from '../../models/Translation';
import styles from './HowItWorks.module.less';

export interface Step extends Record<'title' | 'description' | 'icon' | 'color', string> {
  id: number;
}

export interface HowItWorksProps extends Partial<
  Record<'title' | 'subtitle' | 'learnMoreLink', string>
> {
  steps?: Step[];
  showLearnMore?: boolean;
}

export const HowItWorks: FC<HowItWorksProps> = observer(
  ({
    title,
    subtitle,
    steps,
    showLearnMore = true,
    learnMoreLink = '/open-library/how-to-borrow',
  }) => {
    const { t } = useContext(I18nContext);
    const resolvedTitle = title ?? t('how_it_works');
    const resolvedSubtitle = subtitle ?? t('how_it_works_description');
    const resolvedSteps: Step[] = steps ?? [
      {
        id: 1,
        title: t('step_1_find_book'),
        description: t('step_1_description'),
        icon: '🔍',
        color: '#6f42c1',
      },
      {
        id: 2,
        title: t('step_2_apply'),
        description: t('step_2_description'),
        icon: '📄',
        color: '#0d6efd',
      },
      {
        id: 3,
        title: t('step_3_receive'),
        description: t('step_3_description'),
        icon: '↔️',
        color: '#fd7e14',
      },
    ];

    return (
      <section className="py-12 bg-white">
        <Container fluid="xl" className="px-5">
          <div className="text-center mb-12">
            <h2 className="fs-4xl fw-bold fg-black mb-5 position-relative">
              {resolvedTitle}
              <div className="position-absolute start-50 translate-middle-x mt-3">
                <div className={`bg-primary rounded-pill ${styles.sectionTitleMarker}`} />
              </div>
            </h2>
            <p className={`fs-lg fw-light fg-secondary mx-auto ${styles.subtitle}`}>
              {resolvedSubtitle}
            </p>
          </div>

          <Row as="ol" className="g-7 list-unstyled mb-0">
            {resolvedSteps.map(({ id, title, description, icon, color }, index) => (
              <Col key={id} as="li" md={6} lg={3}>
                <div className="text-center p-5">
                  <div
                    className={`position-relative mb-5 d-flex justify-content-center ${styles.stepIconWrap}`}
                  >
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center fg-white fs-xl shadow position-relative ${styles.stepIcon}`}
                      style={{ '--step-color': color } as CSSProperties}
                    >
                      {icon}
                    </div>
                    <span
                      className={`position-absolute bg-danger fg-white rounded-circle d-flex align-items-center justify-content-center fw-bold small ${styles.stepNumber}`}
                    >
                      {id}
                    </span>
                    {index < resolvedSteps.length - 1 && (
                      <div
                        className={`position-absolute bg-secondary d-none lg:d-block ${styles.connector}`}
                      >
                        <div className={`position-absolute ${styles.connectorArrow}`} />
                      </div>
                    )}
                  </div>
                  <h3 className="h5 fw-semibold fg-black mb-5">{title}</h3>
                  <p className="fg-secondary lh-md">{description}</p>
                </div>
              </Col>
            ))}
          </Row>

          {showLearnMore && (
            <div className="text-center mt-12">
              <Link href={learnMoreLink} passHref legacyBehavior>
                <Button
                  theme="primary"
                  variant="outline"
                  size="lg"
                  as="a"
                  className="rounded-pill px-7 fw-semibold"
                >
                  ℹ️ {t('learn_more_details')} →
                </Button>
              </Link>
            </div>
          )}
        </Container>
      </section>
    );
  },
);
