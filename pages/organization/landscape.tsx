import { observer } from 'mobx-react';
import { compose } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { ChinaPublicInterestLandscape } from '../../components/Organization/ChinaPublicInterestLandscape';
import { Organization,OrganizationModel } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';

export interface ChinaPublicInterestLandscapeProps {
  tagMap: Record<string, Organization[]>;
}

export const getServerSideProps = compose<{}, ChinaPublicInterestLandscapeProps>(
  async () => {
    try {
      const tagMap = await new OrganizationModel().groupAllByTags();

      return { props: JSON.parse(JSON.stringify({ tagMap })) };
    } catch (error) {
      console.error('Failed to fetch organization landscape data:', error);

      // Return empty data on error to allow page to render
      return {
        props: {
          tagMap: {},
        },
      };
    }
  },
);

const LandscapePage: FC<ChinaPublicInterestLandscapeProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="mb-5">
      <PageHead title={t('china_public_interest_landscape')} />

      <h1 className="my-5 text-center">{t('china_public_interest_landscape')}</h1>

      <ChinaPublicInterestLandscape {...props} />
    </Container>
  );
});

export default LandscapePage;