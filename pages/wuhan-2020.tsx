import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import {
  Badge,
  Card,
  Col,
  Container,
  Row,
} from 'react-bootstrap';

import { PageHead } from '../components/Layout/PageHead';
import { I18nContext } from '../models/Translation';

interface Category {
  icon: string;
  title: string;
  description: string;
  href?: string;
  badge?: string;
}

const categories: Category[] = [
  {
    icon: '🏥',
    title: '医院',
    description:
      '武汉及周边地区医院物资需求信息，包括防护服、口罩、消毒液等医疗物资的供需对接',
    href: 'https://github.com/wuhan2020/WebApp',
    badge: 'Hospital',
  },
  {
    icon: '🚚',
    title: '物流',
    description:
      '救援物资运输渠道信息，物流公司运力资源、运输路线及配送协调',
    href: 'https://github.com/wuhan2020/WebApp',
    badge: 'Logistics',
  },
  {
    icon: '🏨',
    title: '酒店',
    description:
      '为医护人员提供免费或优惠住宿的酒店信息，以及酒店资源对接',
    href: 'https://github.com/wuhan2020/WebApp',
    badge: 'Hotel',
  },
  {
    icon: '🏭',
    title: '生产',
    description:
      '医疗物资生产企业信息，包括产能、原材料需求及供应渠道对接',
    href: 'https://github.com/wuhan2020/WebApp',
    badge: 'Factory',
  },
  {
    icon: '❤️',
    title: '捐赠',
    description:
      '社会捐赠渠道信息，资金与物资捐赠的对接平台及需求公示',
    href: 'https://github.com/wuhan2020/WebApp',
    badge: 'Donation',
  },
  {
    icon: '💊',
    title: '义诊',
    description:
      '在线义诊服务平台，连接医疗专家与社区居民的远程问诊渠道',
    href: 'https://github.com/wuhan2020/WebApp',
    badge: 'Clinic',
  },
  {
    icon: '🗺️',
    title: '疫情地图',
    description:
      '基于实时数据的疫情分布地图，展示各省市确诊、疑似、治愈等统计数据',
    href: 'https://github.com/wuhan2020/WebApp/tree/dev/source/page/Map',
    badge: 'Map',
  },
  {
    icon: '👥',
    title: '开放社区',
    description:
      '志愿者协作社区，汇聚开发、运维、数据、医疗等各方力量共同抗疫',
    href: 'https://github.com/wuhan2020/WebApp',
    badge: 'Community',
  },
];

const techStack = [
  { name: 'TypeScript', icon: '📘' },
  { name: 'React / WebCell', icon: '⚛️' },
  { name: 'MobX', icon: '📦' },
  { name: 'ECharts', icon: '📊' },
  { name: 'Supabase', icon: '🗄️' },
  { name: 'Bootstrap', icon: '🎨' },
];

const Wuhan2020Page: FC = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <>
      <PageHead
        title="新冠战疫信息平台 — 武汉 2020"
        description="武汉新型冠状病毒防疫信息平台开放数据存档 — 记录 2020 年抗疫期间医疗物资、物流、捐赠、义诊等信息的协作平台"
      />

      {/* Hero Section */}
      <section className="bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={8}>
              <h1 className="display-4 fw-bold mb-3">
                🦠 新冠战疫信息平台
              </h1>
              <p className="lead mb-4">
                武汉新型冠状病毒防疫信息平台 —
                开放数据存档
              </p>
              <p className="fs-5 mb-4">
                本页面是 wuhan2020/WebApp 开源项目的存档展示，记录 2020
                年抗疫期间，由社区志愿者共同构建的救援信息协作平台。
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <a
                  className="btn btn-primary btn-lg"
                  href="https://github.com/wuhan2020/WebApp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="me-2">📂</span>
                  查看原始项目
                </a>
                <a
                  className="btn btn-outline-light btn-lg"
                  href="https://github.com/wuhan2020"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="me-2">🏛️</span>
                  访问组织
                </a>
              </div>
            </Col>
            <Col xs={12} md={4} className="text-center mt-4 mt-md-0">
              <div
                className="display-1"
                aria-label="COVID-19 Rescue Platform"
              >
                🏥
              </div>
              <Badge bg="warning" text="dark" className="mt-2 fs-6">
                🌟 392 Stars · 140 Forks
              </Badge>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="bg-light py-5">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <h2 className="text-center mb-4">📋 项目简介</h2>
              <div className="bg-white p-4 rounded-4 shadow-sm">
                <p className="fs-5">
                  <strong>新冠战疫信息平台</strong>（Wuhan2020
                  WebApp）是一个在 2020
                  年新冠疫情爆发期间，由全球华人开发者志愿者自发组织构建的
                  <strong>渐进式 Web 应用</strong>。
                </p>
                <p>
                  平台旨在高效对接救援物资、医疗资源、物流运输、酒店住宿等关键信息，帮助抗疫一线的医护人员和受困群众。采用开源协作模式，汇集了来自全球的开发者、数据科学家、医疗专家等志愿者的力量。
                </p>
                <p className="mb-0">
                  本项目作为开放数据存档，保留了原始平台的核心功能展示和数据结构，供历史研究、学术参考和社区纪念。
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Tech Stack Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-4">🛠️ 技术栈</h2>
          <Row className="justify-content-center">
            {techStack.map(({ name, icon }) => (
              <Col key={name} xs={6} sm={4} md={3} lg={2} className="mb-3">
                <Card body className="text-center shadow-sm h-100">
                  <div className="fs-1 mb-2">{icon}</div>
                  <div className="fw-bold">{name}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-2">📂 功能模块</h2>
          <p className="text-center text-muted mb-5">
            平台涵盖以下核心功能模块，覆盖抗疫救援的各个方面
          </p>
          <Row className="g-4">
            {categories.map(
              ({ icon, title, description, href, badge }) => (
                <Col key={title} xs={12} sm={6} lg={4} xl={3}>
                  <Card className="shadow-sm h-100 border-0">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-center mb-3">
                        <span className="fs-1 me-3">{icon}</span>
                        <div>
                          <Card.Title className="mb-1">{title}</Card.Title>
                          {badge && (
                            <Badge bg="secondary" className="fs-6">
                              {badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Card.Text className="text-muted flex-grow-1">
                        {description}
                      </Card.Text>
                      {href && (
                        <a
                          className="btn btn-outline-primary btn-sm mt-auto"
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          查看详情 →
                        </a>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ),
            )}
          </Row>
        </Container>
      </section>

      {/* Data Sources Section */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <h2 className="text-center mb-4">📊 数据源</h2>
              <div className="bg-white p-4 rounded-4 shadow-sm">
                <ul className="list-unstyled mb-0">
                  <li className="mb-3">
                    <strong>🦠 丁香园疫情数据</strong> —{' '}
                    <a
                      href="https://github.com/BlankerL/DXY-COVID-19-Data"
                      target="_blank"
                      rel="noreferrer"
                    >
                      DXY-COVID-19-Data
                    </a>
                    ，由 BlankerL 维护的丁香园疫情数据集合
                  </li>
                  <li className="mb-3">
                    <strong>🗺️ 高德地图 API</strong> — 地图数据与地理信息
                  </li>
                  <li className="mb-3">
                    <strong>📋 社区贡献数据</strong> — 由志愿者提交的医院、物流、捐赠等信息
                  </li>
                  <li className="mb-0">
                    <strong>📦 Supabase 后端</strong> — 基于 PostgreSQL 的实时数据存储与查询
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Archive Notice */}
      <section className="bg-warning bg-opacity-10 py-5">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <div className="text-center">
                <h2 className="mb-3">📜 存档说明</h2>
                <p className="fs-5">
                  本页面为 wuhan2020/WebApp 项目的存档展示版。
                </p>
                <p>
                  原始项目仍托管在{' '}
                  <a
                    href="https://github.com/wuhan2020/WebApp"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                  ，所有代码和数据遵循 AGPL-3.0 开源协议。
                </p>
                <p className="mb-0">
                  感谢所有为抗疫做出贡献的志愿者和开源社区成员。🙏
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
});

export default Wuhan2020Page;