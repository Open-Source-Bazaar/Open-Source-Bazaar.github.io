import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { Award, AwardModel } from '../../models/Award';
import { I18nContext } from '../../models/Translation';

const parseVotes = (votes: unknown) => Number(votes) || 0;

const formatAwardDate = (createdAt: unknown, locale: string) =>
  createdAt
    ? new Date(Number(createdAt)).toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '';

export const getServerSideProps = compose(cache(), errorLogger, async () => {
  const awards = await new AwardModel().getAll();

  const sortedAwards = [...awards].sort((a, b) => parseVotes(b.votes) - parseVotes(a.votes));

  return { props: { awards: sortedAwards } };
});

const AwardPage: FC<{ awards: (Award & { id: string })[] }> = observer(({ awards }) => {
  const { currentLanguage, t } = useContext(I18nContext);

  // Observable list state populated initially from SSR props
  const [awardList, setAwardList] = useState<(Award & { id: string })[]>(awards);

  // Form states
  const [nominator, setNominator] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeDesc, setNomineeDesc] = useState('');
  const [reason, setReason] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);

  // Refresh award list from Lark Bitable
  const refreshAwards = async () => {
    try {
      const updated = await new AwardModel().getAll();
      const sorted = [...updated].sort(
        (a, b) => parseVotes(b.votes) - parseVotes(a.votes),
      ) as (Award & { id: string })[];
      setAwardList(sorted);
    } catch (err: any) {
      console.error('Failed to refresh awards:', err);
    }
  };

  // Submit nomination
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nominator.trim() || !nomineeName.trim() || !reason.trim()) {
      setError(t('award_required_error'));
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await new AwardModel().updateOne({
        awardName: '开放协作人奖',
        nomineeName: nomineeName.trim(),
        nomineeDesc: nomineeDesc.trim(),
        videoUrl: videoUrl.trim(),
        reason: reason.trim(),
        nominator: nominator.trim(),
        votes: 0,
        createdAt: Date.now(),
      } as any);

      setSuccess(true);
      setNominator('');
      setNomineeName('');
      setNomineeDesc('');
      setReason('');
      setVideoUrl('');

      // Refresh list to show new nominee
      await refreshAwards();
    } catch (err: any) {
      console.error(err);
      setError(err.message || t('award_submit_error'));
    } finally {
      setLoading(false);
    }
  };

  // Upvote candidate
  const handleVote = async (awardId: string, currentVotes: any) => {
    if (votingId) return;
    setVotingId(awardId);
    try {
      const parsedVotes = parseVotes(currentVotes);

      // Optimistic local update
      setAwardList(prev =>
        prev.map(item => (item.id === awardId ? { ...item, votes: parsedVotes + 1 } : item)),
      );

      await new AwardModel().updateOne(
        {
          votes: parsedVotes + 1,
        } as any,
        awardId,
      );

      // Refresh to sync state with database
      await refreshAwards();
    } catch (err: any) {
      console.error(err);
      setError(err.message || t('award_vote_error'));
      // Revert on failure
      await refreshAwards();
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div
      style={{
        background:
          'radial-gradient(circle at top left, rgba(99, 102, 241, 0.12), transparent 45%),' +
          'radial-gradient(circle at 85% 20%, rgba(236, 72, 153, 0.1), transparent 35%),' +
          'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        minHeight: '100vh',
        paddingBottom: '5rem',
      }}
    >
      <PageHead title={t('award_page_title')} />

      {/* Hero Banner Section */}
      <Container className="pt-5">
        <Row className="align-items-center mb-5">
          <Col lg={7} className="text-center text-lg-start mb-4 mb-lg-0">
            <Badge
              bg="indigo"
              className="mb-3 px-3 py-2 text-indigo bg-indigo-100 rounded-pill font-semibold"
            >
              {t('award_badge')}
            </Badge>
            <h1
              className="display-4 font-black mb-3"
              style={{
                fontWeight: 900,
                background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('open_collaborator_award')}
            </h1>
            <p className="lead text-secondary mb-4 fs-5" style={{ maxWidth: '600px' }}>
              {t('award_intro')}
            </p>
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
              <Button
                href="#nominate-form"
                className="btn btn-indigo px-4 py-2.5 rounded-pill shadow-sm font-bold border-0"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                  fontWeight: 700,
                }}
              >
                {t('award_nominate_button')}
              </Button>
              <Button
                href="#nominees-list"
                variant="outline-secondary"
                className="px-4 py-2.5 rounded-pill font-bold"
                style={{ fontWeight: 700 }}
              >
                {t('award_view_nominees_button')} ({awardList.length})
              </Button>
            </div>
          </Col>
          <Col lg={5}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden bg-white/40 backdrop-blur-md p-2">
              <div className="ratio ratio-16x9 rounded-3 overflow-hidden border border-slate-100">
                <iframe
                  src="https://player.bilibili.com/player.html?aid=978564817&bvid=BV1c44y1x7ij&cid=494424932&page=1&high_quality=1&danmaku=0"
                  title={t('award_video_title')}
                  scrolling="no"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <Card.Body className="py-3 px-2 text-center">
                <Card.Text className="text-muted text-xs">{t('award_video_caption')}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Guidelines / Info Section */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-3 bg-white hover-shadow transition-all">
              <Card.Body>
                <div className="fs-2 mb-3">🏆</div>
                <h3 className="fs-5 font-bold mb-2">{t('award_what_title')}</h3>
                <p className="text-secondary text-sm mb-0">{t('award_what_desc')}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-3 bg-white hover-shadow transition-all">
              <Card.Body>
                <div className="fs-2 mb-3">🤝</div>
                <h3 className="fs-5 font-bold mb-2">{t('award_who_title')}</h3>
                <p className="text-secondary text-sm mb-0">{t('award_who_desc')}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-3 bg-white hover-shadow transition-all">
              <Card.Body>
                <div className="fs-2 mb-3">💡</div>
                <h3 className="fs-5 font-bold mb-2">{t('award_rules_title')}</h3>
                <p className="text-secondary text-sm mb-0">{t('award_rules_desc')}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Work Area */}
        <Row className="g-5">
          {/* Left Column: Candidates list */}
          <Col lg={7} id="nominees-list">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fs-3 font-black text-indigo-950 m-0 flex items-center gap-2">
                {t('award_nominee_list_title')}{' '}
                <Badge
                  bg="secondary"
                  className="fs-6 py-1.5 px-2 bg-slate-200 text-slate-700 rounded-pill"
                >
                  {awardList.length}
                </Badge>
              </h2>
            </div>

            {awardList.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-white/50">
                <div className="fs-1 text-slate-300 mb-3">📭</div>
                <h4 className="text-slate-600 font-bold">{t('award_empty_title')}</h4>
                <p className="text-slate-400 text-sm">{t('award_empty_desc')}</p>
              </Card>
            ) : (
              <div className="d-flex flex-column gap-4">
                {awardList.map(award => {
                  const awardId = award.id;
                  const votesCount = parseVotes(award.votes);
                  const formattedDate = formatAwardDate(award.createdAt, currentLanguage);

                  return (
                    <Card
                      key={awardId}
                      className="border-0 shadow-sm rounded-4 bg-white overflow-hidden hover-shadow transition-all border-l-4"
                      style={{ borderLeft: '4px solid #6366f1' }}
                    >
                      <Card.Body className="p-4">
                        <Row className="align-items-start">
                          <Col className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <h3 className="fs-5 font-black text-indigo-950 m-0">
                                {award.nomineeName as string}
                              </h3>
                              {award.nomineeDesc && (
                                <Badge
                                  bg="light"
                                  className="text-slate-500 font-normal px-2 py-1 rounded"
                                >
                                  {award.nomineeDesc as string}
                                </Badge>
                              )}
                            </div>
                            <div className="text-slate-400 text-xs mb-3">
                              {t('award_nominator_meta')}
                              <span className="text-indigo-600 font-bold">
                                {award.nominator as string}
                              </span>{' '}
                              · {t('award_time_meta')}
                              {formattedDate || t('award_recent')}
                            </div>
                            <div className="text-slate-700 text-sm bg-slate-50 rounded-3 p-3 mb-3 border border-slate-100/50">
                              <strong className="text-slate-800 d-block mb-1">
                                {t('award_reason_meta')}
                              </strong>
                              {award.reason as string}
                            </div>
                            {award.videoUrl && (
                              <div className="text-xs mb-2">
                                {t('award_evidence_meta')}
                                <a
                                  href={award.videoUrl as string}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 font-semibold hover-underline"
                                >
                                  {t('award_evidence_link')}
                                </a>
                              </div>
                            )}
                          </Col>

                          {/* Vote Action Box */}
                          <Col xs="auto" className="text-center ps-3">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-4 px-3 py-3 text-center min-w-[90px]">
                              <div className="text-xs text-indigo-600 font-bold mb-1">
                                {t('award_votes_label')}
                              </div>
                              <div className="fs-3 font-black text-indigo-950 mb-2">
                                {votesCount}
                              </div>
                              <Button
                                size="sm"
                                variant={votingId === awardId ? 'light' : 'indigo'}
                                className="w-100 rounded-pill font-bold shadow-sm flex items-center justify-center gap-1 border-0"
                                style={{
                                  background:
                                    votingId === awardId
                                      ? '#f1f5f9'
                                      : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                                  color: votingId === awardId ? '#64748b' : '#ffffff',
                                  fontWeight: 700,
                                  fontSize: '11px',
                                }}
                                onClick={() => handleVote(awardId, votesCount)}
                                disabled={votingId !== null}
                              >
                                {votingId === awardId ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  t('award_vote_button')
                                )}
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            )}
          </Col>

          {/* Right Column: Submission Form */}
          <Col lg={5} id="nominate-form">
            <Card
              className="border-0 shadow-lg rounded-4 p-4 sticky-top bg-white/80 backdrop-blur-md border border-white/20"
              style={{ top: '6rem', zIndex: 10 }}
            >
              <Card.Body className="p-2">
                <h3 className="fs-4 font-black text-indigo-950 mb-2">{t('award_form_title')}</h3>
                <p className="text-muted text-xs mb-4">{t('award_form_desc')}</p>

                {success && (
                  <Alert variant="success" className="rounded-3 py-2 px-3 mb-3 text-sm">
                    {t('award_submit_success')}
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="rounded-3 py-2 px-3 mb-3 text-sm">
                    ⚠️ {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3.5">
                  <Form.Group controlId="nominator">
                    <Form.Label className="text-xs font-bold text-slate-700 mb-1">
                      {t('award_nominator_field')} <span className="text-rose-500">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t('award_nominator_placeholder')}
                      value={nominator}
                      onChange={e => setNominator(e.target.value)}
                      required
                      className="rounded-3 text-sm py-2 px-3 border-slate-200"
                    />
                  </Form.Group>

                  <Form.Group controlId="nomineeName">
                    <Form.Label className="text-xs font-bold text-slate-700 mb-1">
                      {t('award_nominee_name_field')} <span className="text-rose-500">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t('award_nominee_name_placeholder')}
                      value={nomineeName}
                      onChange={e => setNomineeName(e.target.value)}
                      required
                      className="rounded-3 text-sm py-2 px-3 border-slate-200"
                    />
                  </Form.Group>

                  <Form.Group controlId="nomineeDesc">
                    <Form.Label className="text-xs font-bold text-slate-700 mb-1">
                      {t('award_nominee_desc_field')}{' '}
                      <span className="text-muted font-normal">{t('award_optional')}</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t('award_nominee_desc_placeholder')}
                      value={nomineeDesc}
                      onChange={e => setNomineeDesc(e.target.value)}
                      className="rounded-3 text-sm py-2 px-3 border-slate-200"
                    />
                  </Form.Group>

                  <Form.Group controlId="reason">
                    <Form.Label className="text-xs font-bold text-slate-700 mb-1">
                      {t('award_reason_field')} <span className="text-rose-500">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder={t('award_reason_placeholder')}
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      required
                      className="rounded-3 text-sm py-2 px-3 border-slate-200"
                    />
                  </Form.Group>

                  <Form.Group controlId="videoUrl">
                    <Form.Label className="text-xs font-bold text-slate-700 mb-1">
                      {t('award_video_field')}{' '}
                      <span className="text-muted font-normal">{t('award_optional')}</span>
                    </Form.Label>
                    <Form.Control
                      type="url"
                      placeholder={t('award_video_placeholder')}
                      value={videoUrl}
                      onChange={e => setVideoUrl(e.target.value)}
                      className="rounded-3 text-sm py-2 px-3 border-slate-200"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 py-2.5 rounded-pill font-bold shadow border-0 mt-3 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                      fontWeight: 700,
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" /> {t('award_submit_loading')}
                      </>
                    ) : (
                      t('award_submit_button')
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
});

export default AwardPage;
