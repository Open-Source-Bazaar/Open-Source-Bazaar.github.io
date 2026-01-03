import { TableCellUser } from 'mobx-lark';
import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Badge, Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';

import { CommentBox } from '../../../../components/Activity/CommentBox';
import { LarkImage } from '../../../../components/LarkImage';
import { PageHead } from '../../../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../../../models/Activity';
import {
  Member,
  MemberModel,
  Person,
  PersonModel,
  Product,
  ProductModel,
  Project,
  ProjectModel,
} from '../../../../models/Hackathon';
import { I18nContext } from '../../../../models/Translation';

export const getServerSideProps = compose<{ id: string; tid: string }>(
  cache(),
  errorLogger,
  async ({ params }) => {
    const activityModel = new ActivityModel();
    const activity = await activityModel.getOne(params!.id);

    // @ts-expect-error Upstream compatibility
    const { appId, tableIdMap } = activity.databaseSchema;

    const projectModel = new ProjectModel(appId, tableIdMap.Project);
    const team = await projectModel.getOne(params!.tid);

    // Get approved members for this project
    const members = await new MemberModel(appId, tableIdMap.Member).getAll({
      project: team.name as string,
      status: 'approved',
    });

    // Get person details for members
    const personModel = new PersonModel(appId, tableIdMap.Person);
    const allPeople = await personModel.getAll();

    // Filter team members from all people based on member records
    const memberPersonNames = members.map((m) => m.person as string);
    const teamMembers = allPeople.filter((person) =>
      memberPersonNames.includes(person.name as string),
    );

    // Get products for this project
    const products = await new ProductModel(appId, tableIdMap.Product).getAll({
      project: team.name as string,
    });

    return {
      props: {
        activity,
        team,
        teamMembers,
        members,
        products,
      },
    };
  },
);

interface TeamPageProps {
  activity: Activity;
  team: Project;
  teamMembers: Person[];
  members: Member[];
  products: Product[];
}

const TeamPage: FC<TeamPageProps> = observer(({ activity, team, teamMembers, products }) => {
  const { t } = useContext(I18nContext);

  const { name: activityName } = activity;
  const { name: displayName, summary: description, createdBy, score } = team;

  const currentRoute = [
    { title: activityName as string, href: `/hackathon/${activityName}` },
    { title: displayName as string },
  ];

  return (
    <Container as="main" className="mt-4">
      <PageHead title={`${displayName} - ${activityName}`} />

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          {currentRoute.map(({ title, href }) =>
            href ? (
              <li key={title} className="breadcrumb-item">
                <a href={href}>{title}</a>
              </li>
            ) : (
              <li key={title} className="breadcrumb-item active" aria-current="page">
                {title}
              </li>
            ),
          )}
        </ol>
      </nav>

      <Row className="mt-4">
        <Col xs={12} sm={4}>
          <Card style={{ minWidth: '15rem' }}>
            <Card.Header className="bg-white">
              <h1 className="h3 my-2">{displayName as string}</h1>
              <p className="text-muted">{description as string}</p>
              {score !== undefined && (
                <div className="text-center mt-3">
                  <Badge bg="primary" className="fs-5">
                    {t('score')}: {score as number}
                  </Badge>
                </div>
              )}
            </Card.Header>
            <Card.Body>
              <h2 className="text-dark fw-bold h6 mb-3">
                👥 {t('team_members')}
              </h2>
              <ul className="list-unstyled">
                {teamMembers.map((member) => (
                  <li key={member.id as string} className="mb-3">
                    <div className="d-flex align-items-center">
                      <LarkImage
                        src={member.avatar}
                        alt={member.name as string}
                        className="rounded-circle me-2"
                        style={{ width: '40px', height: '40px' }}
                      />
                      <div>
                        <div className="fw-bold">{member.name as string}</div>
                        {member.githubLink && (
                          <a
                            href={member.githubLink as string}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted small"
                          >
                            {t('view_github')}
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Tabs defaultActiveKey="update" id="team-detail-tabs">
            <Tab className="pt-2" eventKey="update" title={t('latest_news')}>
              <div className="h1 my-5 text-center text-muted">{t('no_news_yet')}</div>
            </Tab>
            <Tab eventKey="teamWork" title={t('team_works')} className="pt-2">
              <div className="mt-3">
                {products && products.length > 0 ? (
                  <ul className="list-unstyled">
                    {products.map((product) => (
                      <li key={product.id as string} className="mb-3">
                        <Card>
                          <Card.Body>
                            <h5>{product.name as string}</h5>
                            {product.summary && (
                              <p className="text-muted">{product.summary as string}</p>
                            )}
                            <div className="d-flex gap-2 mt-2">
                              {product.link && (
                                <a
                                  href={product.link as string}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  {t('preview')}
                                </a>
                              )}
                              {product.sourceLink && (
                                <a
                                  href={product.sourceLink as string}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-outline-secondary"
                                >
                                  {t('source_code')}
                                </a>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted my-5">
                    {t('no_news_yet')}
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {createdBy && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Body>
                <h3 className="h5">{t('created_by')}</h3>
                <div className="mt-3">
                  <div className="fw-bold">{(createdBy as TableCellUser).name}</div>
                  <a
                    href={`mailto:${(createdBy as TableCellUser).email}`}
                    className="text-muted"
                  >
                    {(createdBy as TableCellUser).email}
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <CommentBox />
    </Container>
  );
});

export default TeamPage;
