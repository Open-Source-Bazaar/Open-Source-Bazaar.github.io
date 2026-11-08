import { Col, PageItem, PageLink, Pagination, Row } from 'idea-react';
import { observer } from 'mobx-react';
import { ComponentClass, FC, useContext } from 'react';

import { SearchPageMeta } from '../../models/System';
import { I18nContext } from '../../models/Translation';

export interface CardPageProps extends SearchPageMeta {
  // Card receives each search result plus layout props injected below.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Card: ComponentClass<any> | FC<any>;
  cardLinkOf?: (id: string) => string;
  pageLinkOf: (page: number) => string;
}

export const CardPage: FC<CardPageProps> = observer(
  ({ Card, cardLinkOf, currentPage, pageIndex, pageCount, pageLinkOf }) => {
    const { t } = useContext(I18nContext);

    return (
      <>
        <Row className="g-5 my-5" xs={1} md={2} lg={3}>
          {currentPage.map(item => (
            <Col key={item.id as string}>
              <Card className="h-100" linkOf={cardLinkOf} {...item} />
            </Col>
          ))}
        </Row>

        <Pagination className="justify-content-center" size="lg">
          <PageItem disabled={pageIndex === 1}>
            <PageLink href={pageLinkOf(pageIndex - 1)} aria-label={t('previous_page')}>
              &lsaquo;
            </PageLink>
          </PageItem>
          <PageItem disabled={pageIndex === pageCount}>
            <PageLink href={pageLinkOf(pageIndex + 1)} aria-label={t('next_page')}>
              &rsaquo;
            </PageLink>
          </PageItem>
        </Pagination>
      </>
    );
  },
);
