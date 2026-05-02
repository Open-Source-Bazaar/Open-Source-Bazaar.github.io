import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Col, Row, Form, Button, Alert, Modal, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faUsers, faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Award, AwardModel } from '../../models/Award';
import { MainLayout } from '../../components/Layout';

export const getServerSideProps = compose(cache(), errorLogger, async () => {
  const awardModel = new AwardModel();
  const awards = await awardModel.getAll();
  
  // Filter for Open Collaborator Award nominations
  const openCollaboratorNominations = awards.filter(
    award => award.awardName === '开放协作人奖' || award.awardName === 'Open Collaborator Award'
  );

  return { 
    props: { 
      nominations: openCollaboratorNominations || [],
      totalNominations: openCollaboratorNominations.length
    } 
  };
});

interface Props {
  nominations: Award[];
  totalNominations: number;
}

const NominationCard: FC<{ nomination: Award }> = ({ nomination }) => (
  <Card className="h-100 shadow-sm hover-shadow-lg transition-shadow">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h5 className="card-title text-primary mb-0">
          <FontAwesomeIcon icon={faUsers} className="me-2" />
          {nomination.nomineeName || '未具名被推薦者'}
        </h5>
        <Badge bg="success" className="fs-6">
          <FontAwesomeIcon icon={faHeart} className="me-1" />
          {nomination.votes || 0}
        </Badge>
      </div>
      
      <p className="card-text text-muted mb-3">
        {nomination.nomineeDesc || '暫無描述'}
      </p>
      
      <div className="border-top pt-3">
        <h6 className="text-secondary mb-2">推薦理由</h6>
        <p className="small text-dark">
          {nomination.reason || '暫無推薦理由'}
        </p>
      </div>
      
      <div className="border-top pt-2 mt-3">
        <small className="text-muted">
          推薦人: {nomination.nominator || '匿名'}
          {nomination.createdAt && (
            <> · {new Date(nomination.createdAt.toString()).toLocaleDateString()}</>
          )}
        </small>
      </div>
    </Card.Body>
  </Card>
);

const NominationForm: FC<{ onSubmit: (data: any) => void; onCancel: () => void }> = ({ 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    nomineeName: '',
    nomineeDesc: '',
    reason: '',
    nominator: '',
    videoUrl: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>被推薦者姓名 *</Form.Label>
            <Form.Control
              type="text"
              value={formData.nomineeName}
              onChange={(e) => handleChange('nomineeName', e.target.value)}
              placeholder="請輸入被推薦者姓名"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>推薦人</Form.Label>
            <Form.Control
              type="text"
              value={formData.nominator}
              onChange={(e) => handleChange('nominator', e.target.value)}
              placeholder="您的姓名（可選）"
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>被推薦者描述</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.nomineeDesc}
          onChange={(e) => handleChange('nomineeDesc', e.target.value)}
          placeholder="請簡要描述被推薦者的背景和貢獻"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>推薦理由 *</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={formData.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          placeholder="請詳細說明推薦理由，包括具體的開源貢獻和協作事例"
          required
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>相關影片連結</Form.Label>
        <Form.Control
          type="url"
          value={formData.videoUrl}
          onChange={(e) => handleChange('videoUrl', e.target.value)}
          placeholder="https://... (可選)"
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="outline-secondary" onClick={onCancel}>
          取消
        </Button>
        <Button variant="primary" type="submit">
          提交推薦
        </Button>
      </div>
    </Form>
  );
};

const OpenCollaboratorAwardPage: FC<Props> = observer(({ nominations, totalNominations }) => {
  const [showNominationForm, setShowNominationForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleNominationSubmit = async (formData: any) => {
    try {
      const awardModel = new AwardModel();
      
      await awardModel.create({
        awardName: '开放协作人奖',
        nomineeName: formData.nomineeName,
        nomineeDesc: formData.nomineeDesc,
        reason: formData.reason,
        nominator: formData.nominator || '匿名',
        videoUrl: formData.videoUrl,
        votes: 0,
        createdAt: new Date().toISOString()
      });

      setSubmitSuccess(true);
      setShowNominationForm(false);
      
      // Refresh page after successful submission
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      setSubmitError('提交失敗，請稍後再試');
      console.error('Nomination submission error:', error);
    }
  };

  return (
    <MainLayout>
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <div className="bg-primary bg-gradient text-white py-5 px-4 rounded-3 mb-4">
            <FontAwesomeIcon icon={faTrophy} size="3x" className="mb-3" />
            <h1 className="display-4 fw-bold mb-3">開放協作人獎</h1>
            <p className="lead mb-4">
              表彰在開源領域展現卓越協作精神與傑出貢獻的個人與團隊
            </p>
            <div className="d-flex justify-content-center gap-4 text-white-50">
              <div>
                <strong>{totalNominations}</strong>
                <br />
                <small>總推薦數</small>
              </div>
              <div className="vr"></div>
              <div>
                <strong>{new Date().getFullYear()}</strong>
                <br />
                <small>年度獎項</small>
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {submitSuccess && (
          <Alert variant="success" dismissible onClose={() => setSubmitSuccess(false)}>
            <FontAwesomeIcon icon={faHeart} className="me-2" />
            推薦提交成功！感謝您的參與，頁面將自動刷新。
          </Alert>
        )}

        {/* Error Alert */}
        {submitError && (
          <Alert variant="danger" dismissible onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        {/* Award Introduction Video */}
        <div className="mb-5">
          <Card>
            <Card.Header>
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faTrophy} className="me-2 text-warning" />
                獎項介紹影片
              </h4>
            </Card.Header>
            <Card.Body>
              <div className="ratio ratio-16x9">
                <iframe
                  src="//player.bilibili.com/player.html?aid=978564817&bvid=BV1c44y1x7ij&cid=494424932&page=1&high_quality=1&danmaku=0"
                  title="开放协作人奖提名倡议"
                  allowFullScreen
                />
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Action Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>
            <FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />
            推薦名單
          </h3>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => setShowNominationForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            推薦候選人
          </Button>
        </div>

        {/* Nominations Grid */}
        {nominations.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {nominations.map((nomination, index) => (
              <Col key={index}>
                <NominationCard nomination={nomination} />
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="text-center py-5">
            <Card.Body>
              <FontAwesomeIcon icon={faUsers} size="3x" className="text-muted mb-3" />
              <h4 className="text-muted">尚無推薦</h4>
              <p className="text-muted mb-4">成為第一個推薦開放協作人獎候選人的人！</p>
              <Button 
                variant="primary" 
                onClick={() => setShowNominationForm(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                立即推薦
              </Button>
            </Card.Body>
          </Card>
        )}

        {/* Nomination Form Modal */}
        <Modal 
          show={showNominationForm} 
          onHide={() => setShowNominationForm(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              推薦開放協作人獎候選人
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NominationForm 
              onSubmit={handleNominationSubmit}
              onCancel={() => setShowNominationForm(false)}
            />
          </Modal.Body>
        </Modal>
      </div>
    </MainLayout>
  );
});

export default OpenCollaboratorAwardPage;