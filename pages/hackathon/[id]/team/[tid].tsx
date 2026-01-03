import { Avatar } from 'idea-react';
import { BiTableSchema, TableCellUser } from 'mobx-lark';
import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Container,
  Modal,
  Ratio,
  Row,
  Tab,
  Tabs,
} from 'react-bootstrap';

import { CommentBox } from '../../../../components/Activity/CommentBox';
import { ProductCard } from '../../../../components/Activity/ProductCard';
import { PageHead } from '../../../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../../../models/Activity';
import {
  Member,
  MemberModel,
  Product,
  ProductModel,
  Project,
  ProjectModel,
} from '../../../../models/Hackathon';
import { I18nContext } from '../../../../models/Translation';

export const getServerSideProps = compose<Record<'id' | 'tid', string>>(
  cache(),
  errorLogger,
  async ({ params }) => {
    const activity = await new ActivityModel().getOne(params!.id);

    // @ts-expect-error Upstream compatibility
    const { appId, tableIdMap } = activity.databaseSchema;

    const project = await new ProjectModel(appId, tableIdMap.Project).getOne(params!.tid);

    // Get approved members for this project
    const members = await new MemberModel(appId, tableIdMap.Member).getAll({
      project: project.name as string,
      status: 'approved',
    });

    // Get products for this project
    const products = await new ProductModel(appId, tableIdMap.Product).getAll({
      project: project.name as string,
    });

    return { props: { activity, project, members, products } };
  },
);

interface ProjectPageProps {
  activity: Activity;
  project: Project;
  members: Member[];
  products: Product[];
}

const ProjectPage: FC<ProjectPageProps> = observer(({ activity, project, members, products }) => {
  const { t } = useContext(I18nContext);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const { name: activityName, databaseSchema } = activity;
  const { formLinkMap } = databaseSchema as unknown as BiTableSchema;
  const { name: displayName, summary: description, createdBy, score } = project;

  const currentRoute = [
    { title: activityName as string, href: ActivityModel.getLink(activity) },
    { title: displayName as string },
  ];

  return (
    <Container as="main" className="mt-4">
      <PageHead title={`${displayName} - ${activityName}`} />

      <Breadcrumb aria-label="breadcrumb">
        {currentRoute.map(({ title, href }, index, { length }) => {
          const isActive = index === length - 1;

          return (
            <Breadcrumb.Item key={title} href={isActive ? undefined : href} active={isActive}>
              {title}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>

      <Row className="mt-4 g-3">
        <Col xs={12} sm={4}>
          <Card>
            <Card.Header className="bg-white">
              <h1 className="h3 my-2">{displayName as string}</h1>
              <p className="text-muted">{description as string}</p>
              {score != null && (
                <div className="text-center mt-3">
                  <Button variant="danger" className="fs-5" onClick={() => setShowScoreModal(true)}>
                    {t('score')}: {score as number}
                  </Button>
                </div>
              )}
            </Card.Header>
            <Card.Body>
              <h2 className="text-dark fw-bold h6 mb-3">👥 {t('team_members')}</h2>
              <ul className="list-unstyled">
                {members.map(({ id, person, githubAccount }) => (
                  <li key={id as string} className="d-flex gap-3 align-items-center">
                    {/* @ts-expect-error Upstream compatibility */}
                    <Avatar src={(person as TableCellUser).avatar_url} />
                    <div>
                      <h3 className="fs-6 m-0 fw-bold">{(person as TableCellUser).name}</h3>

                      {githubAccount && (
                        <a
                          className="text-muted small"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://github.com/${githubAccount}`}
                        >
                          @{githubAccount as string}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Tabs variant="pills" defaultActiveKey="update" id="project-detail-tabs">
            <Tab className="pt-2" eventKey="update" title={t('latest_news')}>
              <div className="h1 my-5 text-center text-muted">{t('no_news_yet')}</div>
            </Tab>
            <Tab eventKey="teamWork" title={t('team_works')} className="pt-2">
              {products && products.length > 0 ? (
                <Row as="ul" className="list-unstyled g-3" xs={2}>
                  {products.map(product => (
                    <Col as="li" key={product.id as string}>
                      <ProductCard {...product} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center text-muted my-5">{t('no_news_yet')}</div>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>

      <Card className="my-4" body>
        <h3 className="h5">{t('created_by')}</h3>
        <div className="mt-3">
          <div className="fw-bold">{(createdBy as TableCellUser).name}</div>
          <a href={`mailto:${(createdBy as TableCellUser).email}`} className="text-muted">
            {(createdBy as TableCellUser).email}
          </a>
        </div>
      </Card>

      <CommentBox />

      <Modal size="lg" centered show={showScoreModal} onHide={() => setShowScoreModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('score')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Ratio aspectRatio="16x9">
            <iframe
              className="w-100 h-100 border-0"
              title={t('score')}
              src={Object.values(formLinkMap.Evaluation)[0]}
            />
          </Ratio>
        </Modal.Body>
      </Modal>
    </Container>
  );
});

export default ProjectPage;
