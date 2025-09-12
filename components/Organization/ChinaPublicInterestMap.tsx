import { observer } from 'mobx-react';
import { FC, useContext, useEffect, useState } from 'react';
import { Card, Col, Container, Nav, Row } from 'react-bootstrap';

import { Organization, OrganizationModel } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';
import { Map } from '../Map';

const organizationModel = new OrganizationModel();

export const ChinaPublicInterestMap: FC = observer(() => {
  const { t } = useContext(I18nContext);
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const orgs = await organizationModel.getAll();
        setOrganizations(orgs);
      } catch (error) {
        console.error('Failed to load organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>{t('china_public_interest_map')}</h1>
          <Nav className="mb-3">
            <Nav.Link href="/ngo/landscape">{t('landscape')}</Nav.Link>
            <Nav.Link href="/ngo">{t('join_the_public_interest_map')}</Nav.Link>
          </Nav>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Map data={organizations} loading={loading} />
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>{t('by_year')}</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted">{t('no_data_available')}</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Header>{t('by_city')}</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted">{t('no_data_available')}</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Header>{t('by_type')}</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted">{t('no_data_available')}</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Header>{t('by_tag')}</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted">{t('no_data_available')}</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <h5>{t('about_china_public_interest_map')}</h5>
              <p>{t('china_public_interest_map_description')}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
});