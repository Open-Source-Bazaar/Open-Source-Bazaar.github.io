import { observer } from 'mobx-react';
import { compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
// Import placeholder for map component - will be created later
import { ChinaPublicInterestMap } from '../../components/Organization/ChinaPublicInterestMap';
import {
  COMMUNITY_BASE_ID,
  OrganizationModel,
  OrganizationStatistic,
  OrganizationStatisticModel,
  OSC_CITY_STATISTIC_TABLE_ID,
  OSC_TAG_STATISTIC_TABLE_ID,
  OSC_TYPE_STATISTIC_TABLE_ID,
  OSC_YEAR_STATISTIC_TABLE_ID,
} from '../../models/Organization';
import { I18nContext } from '../../models/Translation';

export const getServerSideProps = compose(errorLogger, async () => {
  try {
    const [year, city, type, tag] = await Promise.all([
      new OrganizationStatisticModel(COMMUNITY_BASE_ID, OSC_YEAR_STATISTIC_TABLE_ID).countAll(),
      new OrganizationStatisticModel(COMMUNITY_BASE_ID, OSC_CITY_STATISTIC_TABLE_ID).countAll(),
      new OrganizationStatisticModel(COMMUNITY_BASE_ID, OSC_TYPE_STATISTIC_TABLE_ID).countAll(),
      new OrganizationStatisticModel(COMMUNITY_BASE_ID, OSC_TAG_STATISTIC_TABLE_ID).countAll(),
    ]);

    return { props: { year, city, type, tag } };
  } catch (error) {
    console.error('Failed to fetch organization statistics:', error);

    // Return empty data on error to allow page to render
    return {
      props: {
        year: [],
        city: [],
        type: [],
        tag: [],
      },
    };
  }
});

const OrganizationPage: FC<OrganizationStatistic> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <Container>
      <PageHead title={t('china_public_interest_map')} />

      <header className="d-flex justify-content-between align-items-center">
        <h1 className="my-4">{t('china_public_interest_map')}</h1>
        <div>
          <Button className="me-2" size="sm" href="/organization/landscape">
            {t('landscape')}
          </Button>
          <Button
            variant="success"
            size="sm"
            target="_blank"
            href="https://github.com/Open-Source-Bazaar/China-NGO-database"
          >
            {t('join_the_public_interest_map')}
          </Button>
        </div>
      </header>

      <ChinaPublicInterestMap store={new OrganizationModel()} {...props} />
    </Container>
  );
});

export default OrganizationPage;