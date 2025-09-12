import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Badge,Card, Col, Row } from 'react-bootstrap';

import { OrganizationModel, OrganizationStatistic } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';

export interface ChinaPublicInterestMapProps extends OrganizationStatistic {
  store: OrganizationModel;
}

export const ChinaPublicInterestMap: FC<ChinaPublicInterestMapProps> = observer(
  ({ store, year, city, type, tag }) => {
    const { t } = useContext(I18nContext);

    return (
      <div>
        <Row className="g-4">
          <Col md={6} lg={3}>
            <Card>
              <Card.Body>
                <Card.Title>{t('by_year')}</Card.Title>
                <div>
                  {year.slice(0, 5).map(item => (
                    <Badge key={item.label} bg="primary" className="me-2 mb-2">
                      {item.label}: {item.count}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3}>
            <Card>
              <Card.Body>
                <Card.Title>{t('by_city')}</Card.Title>
                <div>
                  {city.slice(0, 5).map(item => (
                    <Badge key={item.label} bg="success" className="me-2 mb-2">
                      {item.label}: {item.count}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3}>
            <Card>
              <Card.Body>
                <Card.Title>{t('by_type')}</Card.Title>
                <div>
                  {type.slice(0, 5).map(item => (
                    <Badge key={item.label} bg="info" className="me-2 mb-2">
                      {item.label}: {item.count}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3}>
            <Card>
              <Card.Body>
                <Card.Title>{t('by_tag')}</Card.Title>
                <div>
                  {tag.slice(0, 5).map(item => (
                    <Badge key={item.label} bg="warning" className="me-2 mb-2">
                      {item.label}: {item.count}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mt-4">
          <Card.Body>
            <Card.Title>{t('about_china_public_interest_map')}</Card.Title>
            <Card.Text>
              {t('china_public_interest_map_description')}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  },
);