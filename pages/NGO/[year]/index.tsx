import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';

import { PageHead } from '../../../components/Layout/PageHead';
import { CityStatisticMap } from '../../../components/Map/CityStatisticMap';
import { SearchBar } from '../../../components/Navigator/SearchBar';
import { OrganizationModel, OrganizationStatistic } from '../../../models/Organization';
import { I18nContext } from '../../../models/Translation';

const OrganizationCharts = dynamic(() => import('../../../components/Organization/Charts'), {
  ssr: false,
});

interface OrganizationPageProps {
  year: string;
  statistic: OrganizationStatistic;
}

export const getServerSideProps = compose<{ year: string }, OrganizationPageProps>(
  cache(),
  errorLogger,
  async ({ params }) => {
    const statistic = await new OrganizationModel().getStatistic({ establishedDate: params!.year });

    return { props: { year: params!.year, statistic } };
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

      <CityStatisticMap data={statistic.coverageArea} />

      <OrganizationCharts {...statistic} />
    </Container>
  );
});
export default OrganizationPage;
