import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../../components/Layout/PageHead';
import {
  OpenCollaborationLandscape,
  OpenCollaborationLandscapeProps,
} from '../../../components/Organization/Landscape';
import { OrganizationModel } from '../../../models/Organization';
import { I18nContext } from '../../../models/Translation';

export const getServerSideProps = compose<{ year: string }, Pick<OrganizationModel, 'typeMap'>>(
  cache(),
  errorLogger,
  async ({ params }) => {
    const typeMap = await new OrganizationModel().groupAllByType({
      establishedDate: params!.year,
    });

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
