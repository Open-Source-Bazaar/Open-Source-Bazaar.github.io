import { GetStaticProps } from 'next';
import { FC, useContext } from 'react';

import { PageHead } from '../../components/Layout/PageHead';
import { ChinaPublicInterestMap } from '../../components/Organization/ChinaPublicInterestMap';
import { I18nContext } from '../../models/Translation';

export const getStaticProps: GetStaticProps = async () => ({
    props: {},
    revalidate: 60 * 60 * 24, // Revalidate once per day
  });

const NGOPage: FC = () => {
  const { t } = useContext(I18nContext);

  return (
    <>
      <PageHead title={t('china_public_interest_map')} />
      <ChinaPublicInterestMap />
    </>
  );
};

export default NGOPage;