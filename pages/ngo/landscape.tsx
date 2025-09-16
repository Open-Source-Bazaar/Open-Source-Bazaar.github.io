import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import {
  OpenCollaborationLandscape,
  OpenCollaborationLandscapeProps,
} from '../../components/Organization/Landscape';
import { OrganizationModel } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';

export const getStaticProps = async () => {
  const categoryMap = await new OrganizationModel().groupAllByTags({ establishedDate: '2008' });

  return { props: JSON.parse(JSON.stringify({ categoryMap })) };
};

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
