import { Card, CardBody, CardText, CardTitle, Col, Row, TimeDistance } from 'idea-react';
import { TableCellLocation } from 'mobx-lark';
import { BadgeBar } from 'mobx-restful-table';
import type { FC } from 'react';

import { type Activity, ActivityModel } from '../../models/Activity';
import { TimeOption } from '../data';
import { LarkImage } from '../LarkImage';

export interface ActivityCardProps extends Activity {
  className?: string;
}

export const ActivityCard: FC<ActivityCardProps> = ({
  className = '',
  id,
  host,
  name,
  startTime,
  city,
  location,
  image,
  ...activity
}) => (
  <Card
    className={`shadow-sm ${className}`}
    style={{ contentVisibility: 'auto', containIntrinsicHeight: '23rem' }}
  >
    <div className="position-relative w-100" style={{ paddingBottom: '56%' }}>
      <div className="position-absolute top-0 left-0 w-100 h-100">
        <LarkImage
          className="card-img-top h-100 object-fit-cover"
          style={{ objectPosition: 'top left' }}
          src={image}
        />
      </div>
    </div>
    <CardBody className="d-flex flex-column">
      <CardTitle as="h3" className="h5 flex-fill">
        <a
          className="text-decoration-none fg-secondary text-truncate-lines"
          href={ActivityModel.getLink({ id, ...activity })}
        >
          {name as string}
        </a>
      </CardTitle>

      <Row className="mt-3 flex-fill">
        <Col className="text-start">
          <CardText
            className="mt-1 text-truncate"
            title={(location as TableCellLocation)?.full_address}
          >
            <span className="me-1">{city as string}</span>

            {(location as TableCellLocation)?.full_address}
          </CardText>
        </Col>
      </Row>
      <Row as="footer" className="flex-fill small mt-1">
        <Col span={8}>
          <BadgeBar
            list={(host as string[]).map(text => ({
              text,
              link: `/search/activity?keywords=${text}`,
            }))}
          />
        </Col>
        <Col className="text-end" span={4}>
          <TimeDistance {...TimeOption} date={startTime as number} />
        </Col>
      </Row>
    </CardBody>
  </Card>
);
