import {
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Carousel,
  CarouselSlide,
  Col,
  Container,
  Row,
  Stack,
  TextTruncate,
} from 'idea-react';
import { TableCellLocation } from 'mobx-lark';
import { CSSProperties, FC, useContext, useEffect, useState } from 'react';

import { Activity, ActivityModel } from '../../models/Activity';
import { I18nContext } from '../../models/Translation';
import { LarkImage } from '../LarkImage';
import styles from './HeroCarousel.module.less';

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

  return !timestamp
    ? ''
    : new Intl.DateTimeFormat(locale, {
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
    const syncDescriptionRows = () => setDescriptionRows(window.innerWidth <= 767.98 ? 4 : 3);
    syncDescriptionRows();

    const observer = new ResizeObserver(syncDescriptionRows);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  return (
    <Container
      as="section"
      fluid
      className={`${styles.heroCarousel} position-relative`}
      style={heroStyle}
    >
      <Carousel
        fade
        autoplay
        pause="hover"
        interval={6500}
        indicators={activities.length > 1}
        controls={activities.length > 1}
        className={`${styles.carousel} h-100`}
      >
        {activities.map(activity => {
          const { id, type, name, host, startTime, cardImage } = activity;

          const href = ActivityModel.getLink(activity);
          const hosts = ((host as string[]) || []).slice(0, 2);
          const locationText = locationTextOf(activity);
          const dateText = formatDateLabel(startTime, currentLanguage);
          const title = (name as string) || t('activity');
          const description = descriptionOf(activity);
          const image = cardImage || activity.image;

          return (
            <CarouselSlide key={id as string} className={`${styles.item} h-100`}>
              <Card
                className={`${styles.slideCard} h-100 rounded-0 border-0 bg-transparent fg-white`}
              >
                <Row className="g-0 h-100 flex-column-reverse md:flex-row">
                  <Col
                    span={12}
                    md={6}
                    lg={5}
                    className="d-flex align-items-center position-relative z-1"
                  >
                    <Container breakpoint="md" className="px-5 md:px-7 xl:px-12 py-12">
                      <CardBody
                        className="p-0 d-flex flex-column justify-content-center"
                        style={infoBodyStyle}
                      >
                        <Stack direction="horizontal" gap={2} className="flex-wrap mb-5 md:mb-7">
                          {(hosts.length ? hosts : [(type as string) || t('hackathon')]).map(
                            item => (
                              <Badge
                                key={item}
                                pill
                                theme="info"
                                className="px-5 py-3 fw-semibold fg-black"
                              >
                                {item}
                              </Badge>
                            ),
                          )}
                          {(dateText || t('event_duration')) && (
                            <Badge
                              pill
                              theme="secondary"
                              className="px-5 py-3 fw-semibold fg-black"
                            >
                              {dateText || t('event_duration')}
                            </Badge>
                          )}
                        </Stack>

                        <CardTitle
                          as="h1"
                          className="fs-5xl fw-bold lh-1 mb-5 md:mb-7"
                          style={{ textWrap: 'balance' }}
                        >
                          {title}
                        </CardTitle>

                        <TextTruncate
                          rows={descriptionRows}
                          className={`${styles.description} fg-white fg-50 mb-7`}
                        >
                          {description}
                        </TextTruncate>

                        <Stack
                          direction="horizontal"
                          gap={3}
                          className="flex-wrap align-items-start md:align-items-center"
                        >
                          <CardText className="mb-0 fs-md fg-emphasis-info fw-semibold">
                            {locationText || t('open_source_bazaar')}
                          </CardText>
                          <Button
                            href={href}
                            theme="secondary"
                            className={`${styles.actionButton} px-7 py-3 fw-semibold text-uppercase`}
                          >
                            {t('hackathon_register_now')}
                          </Button>
                        </Stack>
                      </CardBody>
                    </Container>
                  </Col>

                  <Col span={12} md={6} lg={7} className={`${styles.mediaPane} position-relative`}>
                    <LarkImage src={image} alt={title} className="w-100 h-100 object-fit-cover" />
                  </Col>
                </Row>
              </Card>
            </CarouselSlide>
          );
        })}
      </Carousel>
    </Container>
  );
};
