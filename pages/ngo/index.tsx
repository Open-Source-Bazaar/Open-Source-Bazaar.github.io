import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Day, Second } from 'web-utility';

import { PageHead } from '../../components/Layout/PageHead';
import { CityStatisticMap } from '../../components/Map';
import { SearchBar } from '../../components/Navigator/SearchBar';
import OrganizationCharts from '../../components/Organization/Charts';
import { OrganizationModel, OrganizationStatistic } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';

export const getStaticProps = async () => {
  const props = await new OrganizationModel().countAll(['coverageArea', 'locale', 'entityType'], {
    establishedDate: '2008',
  });
  return { props, revalidate: Day / Second };
};

const OrganizationPage: FC<OrganizationStatistic> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <Container>
      <PageHead title={t('China_NGO_Map')} />

      <header className="d-flex flex-wrap justify-content-around align-items-center my-4">
        <h1 className="my-4">{t('China_NGO_Map')}</h1>
        <div>
          <Button className="me-2" size="sm" href="/NGO/landscape">
            {t('landscape')}
          </Button>
        </div>

        <SearchBar action="/search/NGO" />
      </header>

      <CityStatisticMap data={props.coverageArea} />

      <OrganizationCharts {...props} />
    </Container>
  );
});
export default OrganizationPage;
