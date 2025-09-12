import { FC } from 'react';
import { Badge,Card } from 'react-bootstrap';

import { Organization } from '../../models/Organization';

export interface OrganizationCardProps extends Partial<Organization> {
  onSwitch?: (filter: { type?: string; tags?: string; city?: string }) => void;
}

export const OrganizationCard: FC<OrganizationCardProps> = ({
  name,
  description,
  type,
  city,
  website,
  tags
}) => (
  <Card className="h-100">
    <Card.Body>
      <Card.Title className="h6">{name}</Card.Title>
      {description && (
        <Card.Text className="small text-muted">
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </Card.Text>
      )}
      <div className="mt-2">
        {city && (
          <Badge bg="secondary" className="me-1">
            {city}
          </Badge>
        )}
        {type && (
          <Badge bg="info" className="me-1">
            {type}
          </Badge>
        )}
        {tags?.map(tag => (
          <Badge key={tag} bg="light" text="dark" className="me-1">
            {tag}
          </Badge>
        ))}
      </div>
      {website && (
        <Card.Link
          href={website}
          target="_blank"
          className="small"
        >
          Visit Website
        </Card.Link>
      )}
    </Card.Body>
  </Card>
);