import { CSSProperties, FC, useContext, useEffect, useState } from 'react';
import { TextTruncate } from 'idea-react';
import { TableCellLocation } from 'mobx-lark';
import { Badge, Button, Card, Carousel, Col, Container, Row, Stack } from 'react-bootstrap';

import { Activity, ActivityModel } from '../../models/Activity';
import { I18nContext } from '../../models/Translation';
import { LarkImage } from '../LarkImage';
import styles from './HeroCarousel.module.less';

export const HERO_CAROUSEL_ITEMS = 3;

const timestampOf = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const time = new Date(value).getTime();

    return Number.isFinite(time) ? time : 0;
  }

  return 0;
};

const formatDateLabel = (value: unknown, locale: string) => {
  const timestamp = timestampOf(value);

  if (!timestamp) return '';

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(timestamp);
};

const locationTextOf = ({ city, location }: Activity) =>
  [(city as string) || '', (location as TableCellLocation | undefined)?.full_address || '']
    .filter(Boolean)
    .join(' · ');

const descriptionOf = (activity: Activity) =>
  (activity.summary as string) || locationTextOf(activity) || (activity.type as string) || '';

export const HeroCarousel: FC<{ activities: Activity[] }> = ({ activities }) => {
  const { currentLanguage, t } = useContext(I18nContext);
  const [heroStyle, setHeroStyle] = useState<CSSProperties>();
  const [descriptionRows, setDescriptionRows] = useState(3);
  const infoBodyStyle = { minHeight: 'clamp(0rem, 38vh, 24rem)' } as CSSProperties;

  useEffect(() => {
    const navbar = document.querySelector<HTMLElement>('nav');
    const syncHeroOffset = () => {
      const navbarHeight = navbar?.getBoundingClientRect().height || 56;

      setHeroStyle({
        '--hero-carousel-offset': `${navbarHeight}px`,
      } as CSSProperties);
    };
    const observer = navbar && new ResizeObserver(syncHeroOffset);

    syncHeroOffset();
    if (navbar) observer?.observe(navbar);

    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    const syncDescriptionRows = () => {
      setDescriptionRows(window.innerWidth <= 767.98 ? 4 : 3);
    };

    syncDescriptionRows();
    window.addEventListener('resize', syncDescriptionRows);

    return () => {
      window.removeEventListener('resize', syncDescriptionRows);
    };
  }, []);

  if (!activities.length) return null;

  return (
    <Container
      as="section"
      fluid
      className={`${styles.heroCarousel} position-relative`}
      aria-label={t('home_hackathon_top_bar_aria_label')}
      style={heroStyle}
    >
      <Carousel
        fade
        touch
        pause="hover"
        interval={6500}
        indicators={activities.length > 1}
        controls={activities.length > 1}
        className={`${styles.carousel} h-100`}
      >
        {activities.map(activity => {
          const href = ActivityModel.getLink(activity);
          const hosts = ((activity.host as string[]) || []).slice(0, 2);
          const locationText = locationTextOf(activity);
          const dateText = formatDateLabel(activity.startTime, currentLanguage);
          const title = (activity.name as string) || t('activity');
          const description = descriptionOf(activity);
          const image = activity.cardImage || activity.image;

          return (
            <Carousel.Item key={activity.id as string} className={`${styles.item} h-100`}>
              <Card
                className={`${styles.slideCard} h-100 rounded-0 border-0 bg-transparent text-white`}
              >
                <Row className="g-0 h-100 flex-column-reverse flex-md-row">
                  <Col
                    xs={12}
                    md={6}
                    lg={5}
                    className="d-flex align-items-center position-relative z-1"
                  >
                    <Container fluid="md" className="px-3 px-md-4 px-xl-5 py-5">
                      <Card.Body
                        className="p-0 d-flex flex-column justify-content-center"
                        style={infoBodyStyle}
                      >
                        <Stack direction="horizontal" gap={2} className="flex-wrap mb-3 mb-md-4">
                          {(hosts.length
                            ? hosts
                            : [(activity.type as string) || t('hackathon')]
                          ).map(item => (
                            <Badge
                              key={item}
                              pill
                              bg="info"
                              text="dark"
                              className="px-3 py-2 fw-semibold"
                            >
                              {item}
                            </Badge>
                          ))}
                          {(dateText || t('event_duration')) && (
                            <Badge pill bg="light" text="dark" className="px-3 py-2 fw-semibold">
                              {dateText || t('event_duration')}
                            </Badge>
                          )}
                        </Stack>

                        <Card.Title
                          as="h1"
                          className="display-3 fw-bold lh-1 mb-3 mb-md-4"
                          style={{ textWrap: 'balance' }}
                        >
                          {title}
                        </Card.Title>

                        <TextTruncate
                          rows={descriptionRows}
                          className={`${styles.description} text-white-50 mb-4`}
                        >
                          {description}
                        </TextTruncate>

                        <Stack
                          direction="horizontal"
                          gap={3}
                          className="flex-wrap align-items-start align-items-md-center"
                        >
                          <Card.Text className="mb-0 fs-6 text-info-emphasis fw-semibold">
                            {locationText || t('open_source_bazaar')}
                          </Card.Text>
                          <Button
                            href={href}
                            variant="light"
                            className={`${styles.actionButton} px-4 py-2 fw-semibold text-uppercase`}
                          >
                            {t('home_hackathon_top_bar_action')}
                          </Button>
                        </Stack>
                      </Card.Body>
                    </Container>
                  </Col>

                  <Col xs={12} md={6} lg={7} className={`${styles.mediaPane} position-relative`}>
                    <LarkImage src={image} alt={title} className="w-100 h-100 object-fit-cover" />
                  </Col>
                </Row>
              </Card>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </Container>
  );
};
