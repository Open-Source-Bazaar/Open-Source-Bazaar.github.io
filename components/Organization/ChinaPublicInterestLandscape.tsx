import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Badge,Card, Col, Row } from 'react-bootstrap';

import { Organization } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';

export interface ChinaPublicInterestLandscapeProps {
  tagMap: Record<string, Organization[]>;
}

export const ChinaPublicInterestLandscape: FC<ChinaPublicInterestLandscapeProps> = observer(
  ({ tagMap }) => {
    const { t } = useContext(I18nContext);

    const tagEntries = Object.entries(tagMap).sort(([, a], [, b]) => b.length - a.length);

    return (
      <div>
        {tagEntries.length === 0 && (
          <Card>
            <Card.Body className="text-center py-5">
              <Card.Title>{t('no_data_available')}</Card.Title>
              <Card.Text>{t('landscape_data_loading_message')}</Card.Text>
            </Card.Body>
          </Card>
        )}

        {tagEntries.map(([tag, organizations]) => (
          <Card key={tag} className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{tag}</h5>
              <Badge bg="primary">{organizations.length} {t('organizations')}</Badge>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {organizations.map(org => (
                  <Col key={org.id} md={6} lg={4}>
                    <Card className="h-100">
                      <Card.Body>
                        <Card.Title className="h6">{org.name}</Card.Title>
                        {org.description && (
                          <Card.Text className="small text-muted">
                            {org.description.length > 100
                              ? `${org.description.substring(0, 100)}...`
                              : org.description}
                          </Card.Text>
                        )}
                        <div className="mt-2">
                          {org.city && (
                            <Badge bg="secondary" className="me-1">
                              {org.city}
                            </Badge>
                          )}
                          {org.type && (
                            <Badge bg="info" className="me-1">
                              {org.type}
                            </Badge>
                          )}
                        </div>
                        {org.website && (
                          <Card.Link
                            href={org.website}
                            target="_blank"
                            className="small"
                          >
                            {t('visit_website')}
                          </Card.Link>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  },
);