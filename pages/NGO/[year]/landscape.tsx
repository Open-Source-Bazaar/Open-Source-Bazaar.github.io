import { observer } from 'mobx-react';
import { GetStaticPaths } from 'next';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../../components/Layout/PageHead';
import {
  OpenCollaborationLandscape,
  OpenCollaborationLandscapeProps,
} from '../../../components/Organization/Landscape';
import { OrganizationModel, OrganizationYearStatisticModel } from '../../../models/Organization';
import { I18nContext } from '../../../models/Translation';
import { skipBuilding } from '../../api/SSG';

export const getStaticPaths: GetStaticPaths<{ year: string }> = async () => {
  const yearStore = new OrganizationYearStatisticModel();

  const years = await yearStore.getAll();

  return {
    paths: years.map(({ name }) => name && { params: { year: name! } }).filter(Boolean) as {
      params: { year: string };
    }[],
    fallback: 'blocking',
  };
};

export const getStaticProps = skipBuilding<Pick<OrganizationModel, 'typeMap'>, { year: string }>(
  async ({ params }) => {
    const { year } = params!;

    const organizationStore = new OrganizationModel();

    const typeMap = await organizationStore.groupAllByType({ startYear: year });

    return { props: JSON.parse(JSON.stringify({ typeMap })) };
  },
);

const LandscapePage: FC<OpenCollaborationLandscapeProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="mb-5">
      <PageHead title={t('China_NGO_Landscape')} />

      <h1 className="my-5 text-center">{t('China_NGO_Landscape')}</h1>

      <OpenCollaborationLandscape {...props} />
    </Container>
  );
});
export default LandscapePage;
