import { observer } from 'mobx-react';
import { GetStaticProps } from 'next';
import { FC, useContext } from 'react';

import { PageHead } from '../../components/Layout/PageHead';
import { ChinaPublicInterestMap } from '../../components/Organization/ChinaPublicInterestMap';
import { OrganizationModel, OrganizationStatistic } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';

export interface NGOPageProps extends OrganizationStatistic {
  store: OrganizationModel;
}

export const getStaticProps: GetStaticProps<NGOPageProps> = async () => {
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
      year: Object.entries(yearStats).map(([label, count]) => ({ label, count })),
      city: Object.entries(cityStats).map(([label, count]) => ({ label, count })),
      type: Object.entries(typeStats).map(([label, count]) => ({ label, count })),
      tag: Object.entries(tagStats).map(([label, count]) => ({ label, count })),
      store,
    },
    revalidate: 60 * 60 * 24, // Revalidate once per day
  };
};

const NGOPage: FC<NGOPageProps> = observer(({ store, year, city, type, tag }) => {
  const { t } = useContext(I18nContext);

  return (
    <>
      <PageHead title={t('china_public_interest_map')} />
      <ChinaPublicInterestMap 
        store={store}
        year={year}
        city={city}
        type={type}
        tag={tag}
      />
    </>
  );
});

export default NGOPage;