import { Loading } from 'idea-react';
import { GitRepository, RepositoryModel } from 'mobx-github';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { GitCard } from '../components/Git/Card';
import { PageHead } from '../components/Layout/PageHead';
import { repositoryStore } from '../models/Repository';
import { I18nContext } from '../models/Translation';

export const getServerSideProps = compose(cache(), errorLogger, async () => {
  const list = await new RepositoryModel('Open-Source-Bazaar').getList({
    relation: ['languages'],
  });

  return { props: JSON.parse(JSON.stringify({ list })) };
});

const ProjectListPage: FC<{ list: GitRepository[] }> = observer(({ list }) => {
  const i18n = useContext(I18nContext);
  const { t } = i18n;

  return (
    <Container>
      <PageHead title={t('open_source_projects')} />
      <h1 className="my-4">{t('open_source_projects')}</h1>

      {repositoryStore.downloading > 0 && <Loading />}

      <ScrollList
        translator={i18n}
        store={repositoryStore}
        filter={{ relation: ['languages'] }}
        renderList={allItems => (
          <Row as="ul" className="list-unstyled g-4" xs={1} sm={2}>
            {allItems.map(
              item =>
                item.homepage && (
                  <Col key={item.id} as="li">
                    <GitCard className="h-100 shadow-sm" {...item} />
                  </Col>
                ),
            )}
          </Row>
        )}
        defaultData={list}
      />
    </Container>
  );
});

export default ProjectListPage;
