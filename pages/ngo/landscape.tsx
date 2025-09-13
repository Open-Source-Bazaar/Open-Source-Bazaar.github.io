import { GetStaticProps } from 'next';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { ChinaPublicInterestLandscape } from '../../components/Organization/ChinaPublicInterestLandscape';
import { Organization, OrganizationModel } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';

export interface NGOLandscapePageProps {
  categoryMap: Record<string, Organization[]>;
}

export const getStaticProps: GetStaticProps<NGOLandscapePageProps> = async () => {
  try {
    const store = new OrganizationModel();
    
    const categoryMap = await store.groupAllByTags();
    
    return {
      props: {
        categoryMap,
      },
      revalidate: 60 * 60 * 24, // Revalidate once per day
    };
  } catch (error) {
    console.error('Failed to load landscape data:', error);

    // Return empty data structure when API is not available
    return {
      props: {
        categoryMap: {},
      },
      revalidate: 60 * 60 * 24,
    };
  }
};

const LandscapePage: FC<NGOLandscapePageProps> = ({ categoryMap }) => {
  const { t } = useContext(I18nContext);

  return (
    <>
      <PageHead title={t('china_public_interest_landscape')} />
      <Container className="py-4">
        <ChinaPublicInterestLandscape categoryMap={categoryMap} />
      </Container>
    </>
  );
};

export default LandscapePage;