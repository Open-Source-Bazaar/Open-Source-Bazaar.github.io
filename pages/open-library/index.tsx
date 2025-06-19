import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import FeaturedBooks from '../../components/open-library/FeaturedBooks';
import FooterComponent from '../../components/open-library/Footer';
import HeroSection from '../../components/open-library/HeroSection';
import HowItWorks from '../../components/open-library/HowItWorks';
import { ContentContainer } from '../../components/open-library/Layout';
import LibraryNavbar from '../../components/open-library/Navbar';
import { useOpenLibraryLayout } from '../../components/open-library/useOpenLibraryLayout';
import { t } from '../../models/Translation';

// Sample data - these could be moved to a separate data file in the future
const featuredBooks = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    cover: '/images/placeholder-book.svg',
    description: '编写优雅代码的艺术',
    status: 'available' as const,
    rating: 4.8,
    tags: ['编程', '软件工程'],
  },
  {
    id: 2,
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    cover: '/images/placeholder-book.svg',
    description: 'JavaScript 程序设计精粹',
    status: 'borrowed' as const,
    rating: 4.6,
    tags: ['JavaScript', '前端'],
  },
  {
    id: 3,
    title: 'Design Patterns',
    author: 'Erich Gamma et al.',
    cover: '/images/placeholder-book.svg',
    description: '可复用面向对象软件的基础',
    status: 'available' as const,
    rating: 4.7,
    tags: ['设计模式', '软件架构'],
  },
  {
    id: 4,
    title: "You Don't Know JS",
    author: 'Kyle Simpson',
    cover: '/images/placeholder-book.svg',
    description: 'JavaScript 深度解析系列',
    status: 'available' as const,
    rating: 4.5,
    tags: ['JavaScript', '进阶'],
  },
];

const workflowSteps = [
  {
    id: 1,
    icon: 'bi-search',
    title: '浏览图书',
    description: '在图书目录中寻找你感兴趣的书籍',
    color: '#6f42c1',
  },
  {
    id: 2,
    icon: 'bi-file-earmark-text',
    title: '申请借阅',
    description: '填写借阅申请表单，说明你的借阅意向',
    color: '#0d6efd',
  },
  {
    id: 3,
    icon: 'bi-people',
    title: '联系持书人',
    description: '我们会协助你联系当前的持书人安排交接',
    color: '#fd7e14',
  },
  {
    id: 4,
    icon: 'bi-book-half',
    title: '传递分享',
    description: '阅读完成后，将书籍传递给下一位读者',
    color: '#198754',
  },
];

export default function OpenLibraryHomepage() {
  // Apply Open Library layout styles
  useOpenLibraryLayout();

  return (
    <>
      <Head>
        <title>{`${t('open_library')} - freeCodeCamp 成都社区`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <LibraryNavbar />

      <HeroSection
        title={t('hero_title') || '开放知识，共享阅读'}
        subtitle={
          t('hero_subtitle') ||
          '加入 freeCodeCamp 成都社区图书馆，与志同道合的朋友一起阅读和分享知识'
        }
        ctaText={t('become_member') || '申请加入'}
        ctaLink="https://open-source-bazaar.feishu.cn/share/base/form/shrcngQgMrhjTh6ycO1zcaEWZld"
        heroImage="/images/placeholder-hero.svg"
        heroImageAlt="People sharing books"
      />

      <main>
        {/* About Section */}
        <ContentContainer>
          <div className="py-5">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-primary mb-3">
                📚 关于我们
              </h2>
              <p className="lead text-muted">
                freeCodeCamp 成都社区「Open Library」开放共享图书馆
              </p>
            </div>

            <Row className="g-4 mb-5">
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h4 className="text-primary mb-3">🌟 我们的使命</h4>
                    <p>
                      促进知识交流，推动社区成员之间的学习和成长，增强社区成员之间的互动与信任。
                      我们采用独特的"无储存"借阅模式，让书籍在会员之间自由流转。
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h4 className="text-primary mb-3">💡 核心理念</h4>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        ✦ <strong>知识流动</strong> - 书籍自由流转，促进知识传播
                      </li>
                      <li className="mb-2">
                        ✦ <strong>社区驱动</strong> - 所有书籍来自成员捐赠
                      </li>
                      <li className="mb-2">
                        ✦ <strong>开放共享</strong> - 促进交流和互动
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </ContentContainer>

        {/* Featured Books Section */}
        <div className="bg-light py-5">
          <ContentContainer>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-primary mb-3">
                📖 精选图书
              </h2>
              <p className="lead text-muted">发现社区成员推荐的优质图书</p>
            </div>
            <FeaturedBooks
              title={t('featured_books') || '精选图书'}
              subtitle={
                t('featured_books_subtitle') || '社区成员推荐的优质书籍'
              }
              books={featuredBooks}
              viewAllLink="/open-library/books"
              viewAllText={t('view_all_books') || '查看全部图书'}
            />
          </ContentContainer>
        </div>

        <ContentContainer>
          <HowItWorks
            title={t('how_it_works') || '如何使用 Open Library'}
            subtitle={
              t('how_it_works_description') ||
              '简单四步，让知识在社区中自由流动'
            }
            steps={workflowSteps}
            learnMoreLink="/open-library/how-to-borrow"
          />
        </ContentContainer>

        {/* Simple Donation Section */}
        <div className="bg-primary bg-gradient text-white py-5">
          <ContentContainer>
            <div className="text-center">
              <h2 className="display-6 fw-bold mb-3">💖 支持我们</h2>
              <p className="lead mb-4">
                Open Library
                完全由社区成员的热情和贡献支撑。如果这个项目对你有帮助，
                <br />
                欢迎通过以下方式支持我们的发展。
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <a
                  href="https://github.com/sponsors/your-org"
                  className="btn btn-light btn-lg rounded-pill px-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-heart-fill me-2"></i>
                  GitHub Sponsors
                </a>
                <Link href="/open-library/books">
                  <span className="btn btn-outline-light btn-lg rounded-pill px-4">
                    <i className="bi bi-book me-2"></i>
                    分享你的图书
                  </span>
                </Link>
              </div>
            </div>
          </ContentContainer>
        </div>
      </main>

      <FooterComponent />
    </>
  );
}
