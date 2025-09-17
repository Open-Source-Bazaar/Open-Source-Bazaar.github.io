import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { ZodiacBar } from '../../components/Base/ZodiacBar';
import { PageHead } from '../../components/Layout/PageHead';
import { OrganizationModel } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';

export const getServerSideProps = compose(cache(), errorLogger, async () => {
  const [startYear, endYear] = await new OrganizationModel().getYearRange();

  return { props: { startYear, endYear } };
});

const OrganizationHomePage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = observer(
  props => {
    const { t } = useContext(I18nContext);

    return (
      <Container className="py-5">
        <PageHead title={t('China_NGO_DB')} />
        <h1 className="text-center">{t('China_NGO_DB')}</h1>

        <ZodiacBar {...props} itemOf={year => ({ title: year, link: `/NGO/${year}` })} />
      </Container>
    );
  },
);
export default OrganizationHomePage;
