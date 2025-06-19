import Link from 'next/link';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import { ContentContainer } from './Layout';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  steps?: Step[];
  showLearnMore?: boolean;
  learnMoreLink?: string;
}

const defaultSteps: Step[] = [
  {
    id: 1,
    title: '浏览图书',
    description: '在图书目录中找到你感兴趣的书籍，查看详细信息和当前状态',
    icon: 'bi-search',
    color: '#6f42c1',
  },
  {
    id: 2,
    title: '申请借阅',
    description: '填写借阅申请表单，系统会自动联系当前持书人',
    icon: 'bi-file-earmark-text',
    color: '#0d6efd',
  },
  {
    id: 3,
    title: '线下传递',
    description: '与持书人约定传递方式，通常通过快递或面对面交接',
    icon: 'bi-arrow-left-right',
    color: '#fd7e14',
  },
  {
    id: 4,
    title: '享受阅读',
    description: '阅读完成后，可以写下书评并准备传递给下一位读者',
    icon: 'bi-book-half',
    color: '#198754',
  },
];

const HowItWorks: React.FC<HowItWorksProps> = ({
  title = '如何使用 Open Library',
  subtitle = '简单四步，让知识在社区中自由流动',
  steps = defaultSteps,
  showLearnMore = true,
  learnMoreLink = '/open-library/how-to-borrow',
}) => {
  return (
    <section className="py-5 bg-white">
      <ContentContainer>
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark mb-3 position-relative">
            {title}
            <div className="position-absolute start-50 translate-middle-x mt-2">
              <div
                className="bg-primary rounded-pill"
                style={{ width: '60px', height: '3px' }}
              ></div>
            </div>
          </h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
            {subtitle}
          </p>
        </div>

        <Row className="g-4">
          {steps.map((step, index) => (
            <Col key={step.id} md={6} lg={3}>
              <div className="text-center p-3">
                <div
                  className="position-relative mb-3 d-flex justify-content-center"
                  style={{ height: '80px' }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fs-4 shadow position-relative"
                    style={{
                      backgroundColor: step.color,
                      width: '60px',
                      height: '60px',
                    }}
                  >
                    <i className={`bi ${step.icon}`}></i>
                  </div>
                  <span
                    className="position-absolute bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold small"
                    style={{
                      width: '24px',
                      height: '24px',
                      top: '-10px',
                      right: 'calc(50% - 42px)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {step.id}
                  </span>
                  {/* 连接线仅在大屏幕显示且不是最后一个 */}
                  {index < steps.length - 1 && (
                    <div
                      className="position-absolute bg-secondary d-none d-lg-block"
                      style={{
                        top: '30px',
                        left: 'calc(100% - 30px)',
                        width: '60px',
                        height: '2px',
                      }}
                    >
                      <div
                        className="position-absolute"
                        style={{
                          right: '-6px',
                          top: '-4px',
                          width: '0',
                          height: '0',
                          borderLeft: '6px solid #6c757d',
                          borderTop: '5px solid transparent',
                          borderBottom: '5px solid transparent',
                        }}
                      ></div>
                    </div>
                  )}
                </div>
                <h3 className="h5 fw-semibold text-dark mb-3">{step.title}</h3>
                <p className="text-muted lh-base">{step.description}</p>
              </div>
            </Col>
          ))}
        </Row>

        {showLearnMore && (
          <div className="text-center mt-5">
            <Link href={learnMoreLink} passHref legacyBehavior>
              <Button
                variant="outline-primary"
                size="lg"
                as="a"
                className="rounded-pill px-4 fw-semibold"
              >
                <i className="bi bi-info-circle me-2"></i>
                了解详细流程
                <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </Link>
          </div>
        )}
      </ContentContainer>
    </section>
  );
};

export default HowItWorks;
