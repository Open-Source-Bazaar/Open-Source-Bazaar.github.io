import { Contributor } from 'mobx-github';
import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Container, Row } from 'react-bootstrap';

import { PageHead } from '../components/Layout/PageHead';
import { SectionTitle } from '../components/Layout/SectionTitle';
import { PersonCard } from '../components/PersonCard';
import { repositoryStore } from '../models/Repository';
import { I18nContext } from '../models/Translation';

export const getServerSideProps = compose(cache(), errorLogger, async () => {
  const contributors: Contributor[] = await repositoryStore.getAllContributors();

  return { props: { contributors } };
});

const Organizer: FC<{ contributors: Contributor[] }> = observer(({ contributors }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container>
      <PageHead title={t('volunteer')} />
      <h1 className="py-5 text-center text-md-start ps-md-4">{t('volunteer')}</h1>

      <section className="d-flex justify-content-around align-items-center gap-3 flex-wrap mb-5">
        <a
          className="d-block"
          href="https://next.ossinsight.io/widgets/official/compose-org-participants-roles-ratio?owner_id=73477979&period=past_28_days"
          target="_blank"
          rel="noreferrer"
        >
          <picture>
            <source
              media="(prefers-color-scheme: dark)"
              srcSet="https://next.ossinsight.io/widgets/official/compose-org-participants-roles-ratio/thumbnail.png?owner_id=73477979&period=past_28_days&image_size=5x5&color_scheme=dark"
              width="465"
            />
            <img
              alt="Participants roles of Open Source Bazaar"
              src="https://next.ossinsight.io/widgets/official/compose-org-participants-roles-ratio/thumbnail.png?owner_id=73477979&period=past_28_days&image_size=5x5&color_scheme=light"
              width="465"
            />
          </picture>
        </a>
        <a
          className="d-block"
          href="https://next.ossinsight.io/widgets/official/compose-org-engagement-scatter?owner_id=73477979&period=past_28_days"
          target="_blank"
          rel="noreferrer"
        >
          <picture>
            <source
              media="(prefers-color-scheme: dark)"
              srcSet="https://next.ossinsight.io/widgets/official/compose-org-engagement-scatter/thumbnail.png?owner_id=73477979&period=past_28_days&image_size=5x5&color_scheme=dark"
              width="465"
            />
            <img
              alt="Most engaged people of Open Source Bazaar"
              src="https://next.ossinsight.io/widgets/official/compose-org-engagement-scatter/thumbnail.png?owner_id=73477979&period=past_28_days&image_size=5x5&color_scheme=light"
              width="465"
            />
          </picture>
        </a>
      </section>

      <SectionTitle count={contributors.length}>{t('online_volunteer')}</SectionTitle>
      <Row
        as="ul"
        className="list-unstyled justify-content-center text-center"
        xs={2}
        sm={5}
        md={6}
      >
        {contributors.map(({ login, html_url, contributions }) => (
          <PersonCard
            key={login}
            name={login!}
            avatar={`https://github.com/${login}.png`}
            link={html_url}
            count={contributions}
          />
        ))}
      </Row>
    </Container>
  );
});

export default Organizer;
