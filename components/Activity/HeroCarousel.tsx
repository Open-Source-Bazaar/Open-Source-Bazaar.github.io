import { CSSProperties, FC, useContext, useEffect, useState } from 'react';
import { TableCellLocation } from 'mobx-lark';
import { Badge, Button, Card, Carousel, Col, Container, Row, Stack } from 'react-bootstrap';

import { Activity, ActivityModel } from '../../models/Activity';
import { I18nContext } from '../../models/Translation';
import { LarkImage } from '../LarkImage';
import styles from './HeroCarousel.module.less';

const FALLBACK_LINK = '/hackathon/Labor-AI-hackathon-2026';
const MAX_ITEMS = 5;

const timestampOf = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const time = new Date(value).getTime();

    return Number.isFinite(time) ? time : 0;
  }

  return 0;
};

const formatDateLabel = (value: unknown) => {
  const timestamp = timestampOf(value);

  if (!timestamp) return '';

  return new Intl.DateTimeFormat('zh-CN', {
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

export const HeroCarousel: FC = () => {
  const { t } = useContext(I18nContext);
  const [heroStyle, setHeroStyle] = useState<CSSProperties>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const infoBodyStyle = { minHeight: 'clamp(0rem, 38vh, 24rem)' } as CSSProperties;

  useEffect(() => {
    const navbar = document.querySelector('nav');
    const syncHeroOffset = () => {
      const navbarHeight = navbar?.getBoundingClientRect().height || 56;

      setHeroStyle({
        '--hero-carousel-offset': `${navbarHeight}px`,
      } as CSSProperties);
    };
    const observer =
      typeof ResizeObserver === 'undefined' || !navbar
        ? undefined
        : new ResizeObserver(syncHeroOffset);

    syncHeroOffset();
    if (navbar) observer?.observe(navbar);
    window.addEventListener('resize', syncHeroOffset);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', syncHeroOffset);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const model = new ActivityModel();
        const data = await model.getAll();
        const latestActivities = data
          .filter(({ name }) => Boolean(name))
          .sort(
            ({ startTime: left }, { startTime: right }) => timestampOf(right) - timestampOf(left),
          )
          .slice(0, MAX_ITEMS);

        setActivities(latestActivities);
      } catch (err) {
        console.error('Failed to load activities:', err);
      }
    })();
  }, []);

  const slides = activities.length
    ? activities
    : [
        {
          id: 'fallback',
          name: 'Labor AI Hackathon 2026',
          summary: t('home_hackathon_top_bar_description'),
        } as Activity,
      ];

  return (
    <section
      className={`${styles.heroCarousel} position-relative`}
      aria-label={t('home_hackathon_top_bar_aria_label')}
      style={heroStyle}
    >
      <Carousel
        fade
        touch
        pause="hover"
        interval={6500}
        indicators={slides.length > 1}
        controls={slides.length > 1}
        className={`${styles.carousel} h-100`}
      >
        {slides.map(activity => {
          const href =
            (activity.id as string) === 'fallback'
              ? FALLBACK_LINK
              : ActivityModel.getLink(activity);
          const hosts = ((activity.host as string[]) || []).slice(0, 2);
          const locationText = locationTextOf(activity);
          const dateText = formatDateLabel(activity.startTime);
          const title = (activity.name as string) || 'Activity';
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

                        <Card.Text className={`${styles.description} text-white-50 mb-4`}>
                          {description}
                        </Card.Text>

                        <Stack
                          direction="horizontal"
                          gap={3}
                          className="flex-wrap align-items-start align-items-md-center"
                        >
                          <Card.Text className="mb-0 fs-6 text-info-emphasis fw-semibold">
                            {locationText || 'Open Source Bazaar'}
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
    </section>
  );
};
