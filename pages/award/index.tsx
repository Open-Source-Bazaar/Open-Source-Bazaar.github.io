import { GetStaticProps } from 'next';
import { FC, useContext } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Minute, Second } from 'web-utility';

import { PageHead } from '../../components/Layout/PageHead';
import { Award, AwardModel } from '../../models/Award';
import { hasLarkServerAccess } from '../../models/configuration';
import { I18nContext } from '../../models/Translation';
import { lark } from '../api/Lark/core';

const formatAwardField = (value?: Award[keyof Award]) =>
  typeof value === 'string' || typeof value === 'number'
    ? `${value}`
    : Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string').join(' ')
      : '';

interface AwardPageProps {
  awards: Award[];
  awardsUnavailable: boolean;
}

export const getStaticProps: GetStaticProps<AwardPageProps> = async () => {
  if (!hasLarkServerAccess)
    return {
      props: { awards: [], awardsUnavailable: true },
      revalidate: Minute / Second,
    };

  await lark.getAccessToken();

  const store = new AwardModel();
  store.client = lark.client;

  const awards = await store.getAll();

  return { props: { awards, awardsUnavailable: false }, revalidate: Minute / Second };
};

const AwardPage: FC<AwardPageProps> = ({ awards, awardsUnavailable }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-4">
      <PageHead title={t('open_collaborator_award')} />
      <h1 className="mb-4 text-center text-md-start">{t('open_collaborator_award')}</h1>

      {awards.length ? (
        <Row as="ul" className="list-unstyled g-4" xs={1} md={2}>
          {awards.map(({ awardName, nomineeName, nomineeDesc, reason }, index) => (
            <Col
              key={`${formatAwardField(awardName) || formatAwardField(nomineeName) || 'award'}-${index}`}
              as="li"
            >
              <Card body className="h-100 shadow-sm">
                <h2 className="h5">
                  {formatAwardField(awardName) ||
                    formatAwardField(nomineeName) ||
                    t('open_collaborator_award')}
                </h2>
                {nomineeName && <p className="mb-2 fw-bold">{formatAwardField(nomineeName)}</p>}
                {nomineeDesc && <p>{formatAwardField(nomineeDesc)}</p>}
                {reason && <p className="mb-0">{formatAwardField(reason)}</p>}
              </Card>
            </Col>
          ))}
        </Row>
      ) : awardsUnavailable ? (
        <p className="py-4 text-center text-muted">{t('remote_content_unavailable')}</p>
      ) : (
        <p className="py-4 text-center text-muted">{t('no_awards_yet')}</p>
      )}
    </Container>
  );
};

export default AwardPage;
