import { observer } from 'mobx-react';
import { InferGetStaticPropsType } from 'next';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { ZodiacBar } from 'idea-react';

import { PageHead } from '../../components/Layout/PageHead';
import { OrganizationModel } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';
import { lark } from '../api/Lark/core';

export const getStaticProps = async () => {
  await lark.getAccessToken();

  const organizationStore = new OrganizationModel();
  organizationStore.client = lark.client;

  const [startYear, endYear] = await organizationStore.getYearRange();

  return { props: { startYear, endYear } };
};

const OrganizationHomePage: FC<InferGetStaticPropsType<typeof getStaticProps>> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-5">
      <PageHead title={t('China_NGO_DB')} />
      <h1 className="text-center my-4">{t('China_NGO_DB')} 2.0</h1>

      <ZodiacBar {...props} itemOf={year => ({ title: year, link: `/NGO/${year}` })} />
    </Container>
  );
});
export default OrganizationHomePage;
