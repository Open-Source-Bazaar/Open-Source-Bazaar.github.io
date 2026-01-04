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
import styles from '../../../../styles/Hackathon.module.less';

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
    <>
      <PageHead title={`${displayName} - ${activityName}`} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <Container>
          <Breadcrumb aria-label="breadcrumb" className="mb-4">
            {currentRoute.map(({ title, href }, index, { length }) => {
              const isActive = index === length - 1;

              return (
                <Breadcrumb.Item
                  key={title}
                  href={isActive ? undefined : href}
                  active={isActive}
                  className="text-white"
                >
                  {title}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>

          <h1 className={`text-center ${styles.title}`}>{displayName as string}</h1>
          <p className={`text-center ${styles.description}`}>{description as string}</p>

          {score != null && (
            <div className="text-center mt-4">
              <Button
                variant="light"
                size="lg"
                className="shadow-lg"
                onClick={() => setShowScoreModal(true)}
              >
                {t('score')}: <strong>{score as number}</strong>
              </Button>
            </div>
          )}
        </Container>
      </section>

      <Container className="my-5">
        {/* Team Members Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>👥 {t('team_members')}</h2>
          <Row as="ul" className="list-unstyled mt-4 g-4" xs={1} md={2} lg={3} xl={4}>
            {members.map(({ id, person, githubAccount }) => (
              <Col as="li" key={id as string}>
                <Card className={styles.darkCard} body>
                  <div className="d-flex gap-3 align-items-center">
                    {/* @ts-expect-error Upstream compatibility */}
                    <Avatar src={(person as TableCellUser).avatar_url} size={60} />
                    <div className="flex-grow-1">
                      <h3 className="fs-6 m-0 fw-bold text-white">
                        {(person as TableCellUser).name}
                      </h3>

                      {githubAccount && (
                        <a
                          className="text-white-50 small"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://github.com/${githubAccount}`}
                        >
                          @{githubAccount as string}
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Team Products Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>💡 {t('team_works')}</h2>

          {products && products.length > 0 ? (
            <Row as="ul" className="list-unstyled mt-4 g-4" xs={1} md={2} lg={3}>
              {products.map(product => (
                <Col as="li" key={product.id as string}>
                  <ProductCard {...product} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="h1 my-5 text-center text-muted">{t('no_news_yet')}</div>
          )}
        </section>

        {/* Creator Information Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>👤 {t('created_by')}</h2>
          <Card className={styles.lightCard} body>
            <div className="fw-bold fs-5">{(createdBy as TableCellUser).name}</div>
            <a
              href={`mailto:${(createdBy as TableCellUser).email}`}
              className="text-dark text-decoration-underline"
            >
              {(createdBy as TableCellUser).email}
            </a>
          </Card>
        </section>

        <CommentBox />
      </Container>

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
    </>
  );
});

export default ProjectPage;
