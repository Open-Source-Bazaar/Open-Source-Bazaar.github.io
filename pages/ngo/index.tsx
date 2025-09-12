import { observer } from 'mobx-react';
import { GetStaticProps } from 'next';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { ChinaPublicInterestMap } from '../../components/Organization/ChinaPublicInterestMap';
import { OrganizationModel, OrganizationStatistic } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';

export interface NGOPageProps extends OrganizationStatistic {}

const sortStatistic = (data: Record<string, number>) =>
  Object.entries(data)
    .map(([key, count]) => [key, count] as const)
    .sort(([, vX], [, vY]) => vY - vX);

export const getStaticProps: GetStaticProps<NGOPageProps> = async () => {
  try {
    const store = new OrganizationModel();
    
    const allData = await store.getAll();
    
    // Generate statistics from the data
    const yearStats = allData.reduce((acc, org) => {
      if (org.year) {
        const yearKey = org.year.toString();
        acc[yearKey] = (acc[yearKey] || 0) + 1;
      }

      return acc;
    }, {} as Record<string, number>);

    const cityStats = allData.reduce((acc, org) => {
      if (org.city) {
        acc[org.city] = (acc[org.city] || 0) + 1;
      }

      return acc;
    }, {} as Record<string, number>);

    const typeStats = allData.reduce((acc, org) => {
      if (org.type) {
        acc[org.type] = (acc[org.type] || 0) + 1;
      }

      return acc;
    }, {} as Record<string, number>);

    const tagStats = allData.reduce((acc, org) => {
      if (org.tags) {
        org.tags.forEach(tag => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
      }

      return acc;
    }, {} as Record<string, number>);

    return {
      props: {
        year: Object.fromEntries(sortStatistic(yearStats)),
        city: Object.fromEntries(sortStatistic(cityStats)),
        type: Object.fromEntries(sortStatistic(typeStats)),
        tag: Object.fromEntries(sortStatistic(tagStats)),
      },
      revalidate: 60 * 60 * 24, // Revalidate once per day
    };
  } catch (error) {
    console.error('Failed to load organization data:', error);

    // Return empty data structure when API is not available
    return {
      props: {
        year: {},
        city: {},
        type: {},
        tag: {},
      },
      revalidate: 60 * 60 * 24,
    };
  }
};

const NGOPage: FC<NGOPageProps> = observer((statistics) => {
  const { t } = useContext(I18nContext);
  const store = new OrganizationModel();

  return (
    <>
      <PageHead title={t('china_public_interest_map')} />
      <Container className="py-4">
        <ChinaPublicInterestMap 
          store={store}
          {...statistics}
        />
      </Container>
    </>
  );
});

export default NGOPage;