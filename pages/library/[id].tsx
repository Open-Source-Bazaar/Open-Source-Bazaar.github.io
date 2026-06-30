import { observer } from "mobx-react";
import { cache, compose, errorLogger } from "next-ssr-middleware";
import { FC, useContext } from "react";
import { Badge, Card, Col, Container, Row } from "react-bootstrap";

import { PageHead } from "../../../components/Layout/PageHead";
import { I18nContext } from "../../../models/Translation";
import { libraryBooks } from "../books";

export const getServerSideProps = compose(cache(), errorLogger, async ({ params }) => {
  const book = libraryBooks.find((b) => b.id === params.id);
  if (!book) return { notFound: true };
  return { props: { book } };
});

const BookDetailPage: FC<{ book: (typeof libraryBooks)[number] }> = observer(({ book }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-4">
      <PageHead title={book.title} description={book.description} />
      <a href="/library" className="btn btn-sm btn-outline-secondary mb-4">
        &larr; {t("back_to_library")}
      </a>

      <Row>
        <Col md={4} className="text-center mb-4">
          <img
            src={book.cover}
            alt={book.title}
            className="rounded shadow"
            style={{ maxWidth: "100%", maxHeight: 400, objectFit: "cover" }}
          />
          <div className="mt-3">
            <Badge bg={book.status === "available" ? "success" : "warning"} className="fs-6 px-3 py-2">
              {t(book.status === "available" ? "library_status_available" : "library_status_borrowed" as any)}
            </Badge>
          </div>
        </Col>

        <Col md={8}>
          <h2>{book.title}</h2>
          <p className="text-muted fs-5">{book.author}</p>

          {book.tags && (
            <div className="mb-3 d-flex gap-2 flex-wrap">
              {book.tags.map((tag) => (
                <Badge key={tag} bg="info" className="bg-opacity-25 text-dark">{tag}</Badge>
              ))}
            </div>
          )}

          <p className="lead">{book.description}</p>

          <Card className="mb-4">
            <Card.Header>{t("book_details")}</Card.Header>
            <Card.Body>
              <Row className="g-2">
                {book.publisher && (
                  <Col xs={6}><small className="text-muted">{t("publisher")}</small><div>{book.publisher}</div></Col>
                )}
                {book.year && (
                  <Col xs={6}><small className="text-muted">{t("year")}</small><div>{book.year}</div></Col>
                )}
                {book.isbn && (
                  <Col xs={6}><small className="text-muted">ISBN</small><div>{book.isbn}</div></Col>
                )}
                {book.pages && (
                  <Col xs={6}><small className="text-muted">{t("pages")}</small><div>{book.pages}</div></Col>
                )}
                {book.language && (
                  <Col xs={6}><small className="text-muted">{t("language")}</small><div>{book.language}</div></Col>
                )}
                <Col xs={6}><small className="text-muted">{t("category")}</small><div>{t("library_category_" + book.category as any)}</div></Col>
              </Row>
            </Card.Body>
          </Card>

          {book.status === "borrowed" && book.borrower && (
            <Card className="mb-4 border-warning">
              <Card.Header className="bg-warning bg-opacity-10">{t("borrowing_info")}</Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={6}><small className="text-muted">{t("borrower")}</small><div className="fw-bold">{book.borrower}</div></Col>
                  {book.borrowDate && <Col xs={6}><small className="text-muted">{t("borrow_date")}</small><div>{book.borrowDate}</div></Col>}
                  {book.returnDate && <Col xs={6} className="mt-2"><small className="text-muted">{t("expected_return_date")}</small><div>{book.returnDate}</div></Col>}
                </Row>
              </Card.Body>
            </Card>
          )}

          <Card className="mb-4">
            <Card.Header>{t("borrowing_guide")}</Card.Header>
            <Card.Body>
              <ol className="mb-0">
                <li className="mb-2">{t("borrowing_guide_step1")}</li>
                <li className="mb-2">{t("borrowing_guide_step2")}</li>
                <li className="mb-2">{t("borrowing_guide_step3")}</li>
                <li className="mb-2">{t("borrowing_guide_step4")}</li>
                <li>{t("borrowing_guide_step5")}</li>
              </ol>
            </Card.Body>
          </Card>

          <a href="/library" className="btn btn-primary">&larr; {t("back_to_library")}</a>
        </Col>
      </Row>
    </Container>
  );
});

export default BookDetailPage;