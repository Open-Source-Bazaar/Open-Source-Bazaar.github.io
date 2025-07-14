import { text2color } from 'idea-react';
import type { GitRepository } from 'mobx-github';
import { FC } from 'react';
import { Accordion, Badge, Col, Row } from 'react-bootstrap';

import { IssueCard } from './Card';

export const IssueModule: FC<GitRepository> = ({ name, language, issues }) => (
  <Accordion.Item eventKey={name}>
    <Accordion.Header>
      <Row className="flex-fill align-items-center gx-3">
        <Col xs={4} sm={2}>
          {language && (
            <Badge className="fs-6" bg={text2color(language, ['light'])}>
              {language}
            </Badge>
          )}
        </Col>
        <Col xs={6} sm={8} as="h3" className="m-0 text-truncate">
          {name}
        </Col>
        <Col xs={2} className="text-end">
          <Badge className="fs-6" pill bg="info">
            {issues?.length}
          </Badge>
        </Col>
      </Row>
    </Accordion.Header>

    <Accordion.Body>
      <Row xs={1} sm={2} xl={2} className="g-3">
        {issues?.map(issue => (
          <Col key={issue.title}>
            <IssueCard className="h-100" {...issue} />
          </Col>
        ))}
      </Row>
    </Accordion.Body>
  </Accordion.Item>
);
