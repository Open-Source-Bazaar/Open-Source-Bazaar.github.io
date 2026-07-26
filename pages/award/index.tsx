import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Col, Row, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faUsers, faHeart, faEye, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

import { Award, AwardModel } from '../../models/Award';
import { MainLayout } from '../../components/Layout';

export const getServerSideProps = compose(cache(), errorLogger, async () => {
  const awardModel = new AwardModel();
  const awards = await awardModel.getAll();

  // Group awards by type
  const awardStats = awards.reduce((acc, award) => {
    const awardName = award.awardName?.toString() || 'Unknown';
    if (!acc[awardName]) {
      acc[awardName] = {
        name: awardName,
        nominations: [],
        totalVotes: 0
      };
    }
    acc[awardName].nominations.push(award);
    acc[awardName].totalVotes += Number(award.votes || 0);
    return acc;
  }, {} as Record<string, { name: string; nominations: Award[]; totalVotes: number }>);

  const awardTypes = Object.values(awardStats);

  return { 
    props: { 
      awards,
      awardTypes,
      totalNominations: awards.length
    } 
  };
});

interface Props {
  awards: Award[];
  awardTypes: { name: string; nominations: Award[]; totalVotes: number }[];
  totalNominations: number;
}

const AwardTypeCard: FC<{ 
  awardType: { name: string; nominations: Award[]; totalVotes: number };
  isOpenCollaborator?: boolean;
}> = ({ awardType, isOpenCollaborator = false }) => {
  const getAwardIcon = (name: string) => {
    if (name.includes('协作') || name.includes('Collaborator')) return faUsers;
    return faTrophy;
  };

  const getAwardColor = (name: string) => {
    if (name.includes('协作') || name.includes('Collaborator')) return 'primary';
    return 'warning';
  };

  const getAwardDescription = (name: string) => {
    if (name.includes('协作') || name.includes('Collaborator')) {
      return '表彰在開源領域展現卓越協作精神與傑出貢獻的個人與團隊';
    }
    return '表彰在各領域展現傑出成就的個人與項目';
  };

  return (
    <Card className={`h-100 shadow-sm hover-shadow-lg transition-shadow ${isOpenCollaborator ? 'border-primary' : ''}`}>
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <div className={`bg-${getAwardColor(awardType.name)} bg-gradient text-white rounded-circle p-3 me-3`}>
            <FontAwesomeIcon icon={getAwardIcon(awardType.name)} size="lg" />
          </div>
          <div className="flex-grow-1">
            <h4 className="card-title mb-1">{awardType.name}</h4>
            {isOpenCollaborator && (
              <Badge bg="primary" className="mb-2">Featured Award</Badge>
            )}
          </div>
        </div>

        <p className="card-text text-muted mb-4">
          {getAwardDescription(awardType.name)}
        </p>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-3">
            <div className="text-center">
              <div className="fw-bold text-primary fs-5">{awardType.nominations.length}</div>
              <small className="text-muted">推薦數</small>
            </div>
            <div className="text-center">
              <div className="fw-bold text-success fs-5">{awardType.totalVotes}</div>
              <small className="text-muted">總票數</small>
            </div>
          </div>
          <div className="text-end">
            <small className="text-muted">
              最新推薦: {awardType.nominations.length > 0 
                ? new Date(Math.max(...awardType.nominations.map(n => 
                    new Date(n.createdAt?.toString() || 0).getTime()
                  ))).toLocaleDateString()
                : '無'
              }
            </small>
          </div>
        </div>

        {/* Recent nominations preview */}
        {awardType.nominations.length > 0 && (
          <div className="border-top pt-3 mb-3">
            <small className="text-muted fw-bold">最新推薦:</small>
            <div className="mt-2">
              {awardType.nominations.slice(0, 2).map((nomination, index) => (
                <div key={index} className="d-flex align-items-center mb-1">
                  <FontAwesomeIcon icon={faUsers} className="text-muted me-2" size="sm" />
                  <span className="small text-truncate">
                    {nomination.nomineeName || '未具名候選人'}
                  </span>
                  {nomination.votes && Number(nomination.votes) > 0 && (
                    <Badge bg="outline-success" className="ms-auto">
                      <FontAwesomeIcon icon={faHeart} className="me-1" size="sm" />
                      {nomination.votes}
                    </Badge>
                  )}
                </div>
              ))}
              {awardType.nominations.length > 2 && (
                <small className="text-muted">
                  還有 {awardType.nominations.length - 2} 位候選人...
                </small>
              )}
            </div>
          </div>
        )}

        <div className="d-flex gap-2">
          {isOpenCollaborator ? (
            <Link href="/award/open-collaborator-award" passHref>
              <Button variant="primary" size="sm" className="flex-grow-1">
                <FontAwesomeIcon icon={faEye} className="me-2" />
                查看詳情
              </Button>
            </Link>
          ) : (
            <Button variant="outline-primary" size="sm" className="flex-grow-1">
              <FontAwesomeIcon icon={faEye} className="me-2" />
              查看詳情
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

const AwardPage: FC<Props> = observer(({ awards, awardTypes, totalNominations }) => {
  const openCollaboratorAward = awardTypes.find(
    type => type.name.includes('协作') || type.name.includes('Collaborator')
  );
  
  const otherAwards = awardTypes.filter(
    type => !type.name.includes('协作') && !type.name.includes('Collaborator')
  );

  return (
    <MainLayout>
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <div className="bg-gradient-primary text-white py-5 px-4 rounded-3 mb-4" 
               style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <FontAwesomeIcon icon={faTrophy} size="4x" className="mb-4 text-warning" />
            <h1 className="display-4 fw-bold mb-3">開源市集獎項</h1>
            <p className="lead mb-4">
              表彰開源社群中的傑出貢獻者與創新項目
            </p>
            <div className="d-flex justify-content-center gap-4 text-white-50">
              <div>
                <strong>{awardTypes.length}</strong>
                <br />
                <small>獎項類別</small>
              </div>
              <div className="vr"></div>
              <div>
                <strong>{totalNominations}</strong>
                <br />
                <small>總推薦數</small>
              </div>
              <div className="vr"></div>
              <div>
                <strong>{awardTypes.reduce((sum, type) => sum + type.totalVotes, 0)}</strong>
                <br />
                <small>總票數</small>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Award - Open Collaborator Award */}
        {openCollaboratorAward && (
          <div className="mb-5">
            <div className="d-flex align-items-center mb-3">
              <h2 className="mb-0">
                <FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />
                精選獎項
              </h2>
              <Badge bg="primary" className="ms-3">Featured</Badge>
            </div>
            <Row>
              <Col lg={8} xl={6}>
                <AwardTypeCard 
                  awardType={openCollaboratorAward} 
                  isOpenCollaborator={true}
                />
              </Col>
              <Col lg={4} xl={6} className="d-flex align-items-center">
                <div className="text-center w-100">
                  <div className="mb-3">
                    <FontAwesomeIcon icon={faHeart} size="2x" className="text-danger mb-2" />
                    <h4>立即參與</h4>
                    <p className="text-muted">
                      推薦您認為值得表彰的開源協作者，讓更多人看見他們的貢獻！
                    </p>
                  </div>
                  <Link href="/award/open-collaborator-award" passHref>
                    <Button variant="primary" size="lg">
                      前往推薦
                      <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* All Award Types */}
        <div className="mb-5">
          <h3 className="mb-4">
            <FontAwesomeIcon icon={faTrophy} className="me-2 text-warning" />
            所有獎項類別
          </h3>
          
          {awardTypes.length > 0 ? (
            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
              {awardTypes.map((awardType, index) => (
                <Col key={index}>
                  <AwardTypeCard 
                    awardType={awardType}
                    isOpenCollaborator={
                      awardType.name.includes('协作') || awardType.name.includes('Collaborator')
                    }
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="text-center py-5">
              <Card.Body>
                <FontAwesomeIcon icon={faTrophy} size="3x" className="text-muted mb-3" />
                <h4 className="text-muted">尚無獎項</h4>
                <p className="text-muted mb-4">
                  目前還沒有任何獎項推薦，成為第一個推薦者吧！
                </p>
                <Link href="/award/open-collaborator-award" passHref>
                  <Button variant="primary">
                    <FontAwesomeIcon icon={faUsers} className="me-2" />
                    推薦開放協作人獎
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Statistics Section */}
        <div className="bg-light rounded-3 p-4 mt-5">
          <Row className="text-center">
            <Col md={3} className="mb-3 mb-md-0">
              <div className="h3 text-primary mb-1">{awardTypes.length}</div>
              <div className="text-muted">獎項類別</div>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <div className="h3 text-success mb-1">{totalNominations}</div>
              <div className="text-muted">總推薦數</div>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <div className="h3 text-warning mb-1">
                {awardTypes.reduce((sum, type) => sum + type.totalVotes, 0)}
              </div>
              <div className="text-muted">總票數</div>
            </Col>
            <Col md={3}>
              <div className="h3 text-info mb-1">
                {new Date().getFullYear()}
              </div>
              <div className="text-muted">年度獎項</div>
            </Col>
          </Row>
        </div>
      </div>
    </MainLayout>
  );
});

export default AwardPage;