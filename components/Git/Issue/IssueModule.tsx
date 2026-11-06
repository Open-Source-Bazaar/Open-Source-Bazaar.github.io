import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Badge,
  Col,
  Row,
  text2color,
} from 'idea-react';
import type { GitRepository } from 'mobx-github';
import { FC } from 'react';

import { IssueCard } from './Card';

export const IssueModule: FC<GitRepository> = ({ name, language, issues }) => (
  <AccordionItem>
    <AccordionHeader>
      <Row className="flex-fill align-items-center gx-5">
        <Col span={4} sm={2}>
          {language && (
            <Badge className="fs-md" theme={text2color(language, ['light', 'dark'])}>
              {language}
            </Badge>
          )}
        </Col>
        <Col span={6} sm={8} as="h3" className="m-0 text-truncate">
          {name}
        </Col>
        <Col span={2} className="text-end">
          <Badge className="fs-md" pill theme="info">
            {issues?.length}
          </Badge>
        </Col>
      </Row>
    </AccordionHeader>

    <AccordionBody>
      <Row cols={1} sm={2} xl={2} className="g-5">
        {issues?.map(issue => (
          <Col key={issue.title}>
            <IssueCard className="h-100" {...issue} />
          </Col>
        ))}
      </Row>
    </AccordionBody>
  </AccordionItem>
);
