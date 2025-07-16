import { FC } from 'react';
import { Badge, Card, Col } from 'react-bootstrap';

export interface PersonCardProps {
  avatar: string;
  name: string;
  link?: string;
  position?: string;
  count?: number;
}

export const PersonCard: FC<PersonCardProps> = ({ avatar, name, link, position, count }) => (
  <Col as="li" className="my-3 d-flex justify-content-center">
    <Card className="border-0 align-items-center position-relative">
      {count != null && (
        <Badge className="fs-6 position-absolute top-0 end-0" pill bg="danger">
          {count}
        </Badge>
      )}
      <Card.Img
        className="rounded-circle"
        style={{ width: '8rem' }}
        variant="top"
        src={avatar}
        alt={name}
      />
      <Card.Body>
        <Card.Title as="a" className="fs-6 text-decoration-none stretched-link" href={link || '#'}>
          {name}
        </Card.Title>
        <Card.Subtitle className="fw-light mt-2">{position}</Card.Subtitle>
      </Card.Body>
    </Card>
  </Col>
);
