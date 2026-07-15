import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { GetStaticPaths } from 'next';
import { FC, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';

import { PageHead } from '../../../components/Layout/PageHead';
import { CityStatisticMap } from '../../../components/Map/CityStatisticMap';
import { SearchBar } from '../../../components/Navigator/SearchBar';
import {
  OrganizationModel,
  OrganizationStatistic,
  OrganizationYearStatisticModel,
} from '../../../models/Organization';
import { I18nContext } from '../../../models/Translation';
import { lark } from '../../api/Lark/core';
import { skipBuilding } from '../../api/SSG';

const OrganizationCharts = dynamic(() => import('../../../components/Organization/Charts'), {
  ssr: false,
});

interface OrganizationPageProps {
  year: string;
  statistic: OrganizationStatistic;
}

export const getStaticPaths: GetStaticPaths<{ year: string }> = async () => {
  await lark.getAccessToken();

  const yearStore = new OrganizationYearStatisticModel();
  yearStore.client = lark.client;

  const years = await yearStore.getAll();

  return {
    paths: years.map(({ name }) => name && { params: { year: name! } }).filter(Boolean) as {
      params: { year: string };
    }[],
    fallback: 'blocking',
  };
};

export const getStaticProps = skipBuilding<OrganizationPageProps, { year: string }>(
  async ({ params }) => {
    const { year } = params!;

    await lark.getAccessToken();

    const organizationStore = new OrganizationModel();
    organizationStore.client = lark.client;

    const statistic = await organizationStore.getStatistic({ startYear: year });

    return { props: { year, statistic } };
  },
);

const OrganizationPage: FC<OrganizationPageProps> = observer(({ year, statistic }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container>
      <PageHead title={t('China_NGO_Map')} />

      <header className="d-flex flex-wrap justify-content-around align-items-center my-4">
        <h1 className="my-4">{t('China_NGO_Map')}</h1>
        <div>
          <Button className="me-2" size="sm" href={`/NGO/${year}/landscape`}>
            {t('landscape')}
          </Button>
        </div>

        <SearchBar action="/search/NGO" />
      </header>

      <CityStatisticMap data={statistic.city} />

      <OrganizationCharts {...statistic} />
    </Container>
  );
});
export default OrganizationPage;
