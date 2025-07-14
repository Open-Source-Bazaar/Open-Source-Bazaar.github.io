import { Loading } from 'idea-react';
import { GitRepository, RepositoryModel } from 'mobx-github';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Accordion, Breadcrumb, Container } from 'react-bootstrap';

import { IssueModule } from '../components/Git/Issue/IssueModule';
import { PageHead } from '../components/Layout/PageHead';
import { repositoryStore } from '../models/Repository';
import { I18nContext } from '../models/Translation';

export const getServerSideProps = compose(cache(), errorLogger, async () => {
  const list = await new RepositoryModel('Open-Source-Bazaar').getList({
    relation: ['issues'],
  });

  return { props: JSON.parse(JSON.stringify({ list })) };
});

const IssuesPage: FC<{ list: GitRepository[] }> = observer(({ list }) => {
  const i18n = useContext(I18nContext);
  const { t } = i18n;

  return (
    <Container className="py-5">
      <PageHead title="GitHub issues" />
      <Breadcrumb>
        <Breadcrumb.Item href="/">{t('open_source_bazaar')}</Breadcrumb.Item>
        <Breadcrumb.Item active>GitHub issues</Breadcrumb.Item>
      </Breadcrumb>
      <h1>GitHub issues</h1>

      {repositoryStore.downloading > 0 && <Loading />}

      <ScrollList
        translator={i18n}
        store={repositoryStore}
        filter={{ relation: ['issues'] }}
        defaultData={list}
        renderList={allItems => (
          <Accordion>
            {allItems.map(
              repository =>
                !repository.archived &&
                repository.issues?.[0] && (
                  <IssueModule key={repository.name} {...repository} />
                ),
            )}
          </Accordion>
        )}
      />
    </Container>
  );
});

export default IssuesPage;
