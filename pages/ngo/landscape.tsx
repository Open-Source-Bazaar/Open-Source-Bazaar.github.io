import { GetStaticProps } from 'next';
import { FC, useContext } from 'react';

import { PageHead } from '../../components/Layout/PageHead';
import { ChinaPublicInterestLandscape } from '../../components/Organization/ChinaPublicInterestLandscape';
import { I18nContext } from '../../models/Translation';

export const getStaticProps: GetStaticProps = async () => ({
    props: {},
    revalidate: 60 * 60 * 24, // Revalidate once per day
  });

const LandscapePage: FC = () => {
  const { t } = useContext(I18nContext);

  return (
    <>
      <PageHead title={t('china_public_interest_landscape')} />
      <ChinaPublicInterestLandscape />
    </>
  );
};

export default LandscapePage;