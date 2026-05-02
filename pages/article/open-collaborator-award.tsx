import { FC, useContext, useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { I18nContext } from '../../models/Translation';
import styles from './open-collaborator-award.module.less';

interface Nomination {
  id: number;
  awardName: string;
  nomineeName: string;
  nomineeDesc: string;
  videoUrl: string;
  bvid: string;
  reason: string;
  nominator: string;
  contact: string;
  votes: number;
  voters: string[];
  createdAt: string;
}

const initialNominations: Nomination[] = [
  {
    id: 1,
    awardName: '社区老大爷奖',
    nomineeName: '网名叫唐总',
    nomineeDesc: '开源市集社区老大爷，资深开源贡献者，社区精神领袖',
    videoUrl: 'https://www.bilibili.com/video/BV1S44y1J78o/',
    bvid: 'BV1S44y1J78o',
    reason: '网名叫唐总就像社区里的老大爷一样，永远那么亲切、可靠。他见证了社区的成长，也包容着每一个新人的青涩。无论何时，只要社区需要，他总是第一个站出来。他不仅分享技术知识，更传递着开源的精神和文化。在他身上，我看到了真正的社区领袖该有的样子——不是权威，而是榜样。',
    nominator: '诗杰',
    contact: '',
    votes: 180,
    voters: Array.from({ length: 180 }, (_, i) => `voter_${i + 1}`),
    createdAt: '2025-12-15',
  },
  {
    id: 2,
    awardName: '星火奖',
    nomineeName: '水歌',
    nomineeDesc: '开源布道者，用点滴努力点燃开源星火',
    videoUrl: 'https://www.bilibili.com/video/BV1Q3411L7zk/',
    bvid: 'BV1Q3411L7zk',
    reason: '水歌就像一颗星火，虽然看起来微小，却有着燎原之势。他通过不断的分享和实践，将开源的理念传播给更多人。每一篇文章、每一次演讲、每一行代码，都在点燃着他人心中的开源热情。正是这样的星星之火，让越来越多的人加入到开源协作的行列中来。他让我相信，每个人的努力都有价值。',
    nominator: 'Miya',
    contact: '',
    votes: 150,
    voters: Array.from({ length: 150 }, (_, i) => `voter_${i + 1}`),
    createdAt: '2025-12-20',
  },
  {
    id: 3,
    awardName: '最佳观察者奖',
    nomineeName: '止戈',
    nomineeDesc: '敏锐的社区观察者，发现并解决问题的高手',
    videoUrl: 'https://www.bilibili.com/video/BV1dq4y1t73q/',
    bvid: 'BV1dq4y1t73q',
    reason: '止戈有着敏锐的观察力，他总能发现别人忽略的细节和问题。更难能可贵的是，他不仅善于发现问题，还主动寻找解决方案。在社区中，他就像一双明察秋毫的眼睛，帮助我们看到盲区、规避风险、优化流程。他的每一次观察和建议，都让社区变得更好。正是这样的观察者，让我们的协作更加高效。',
    nominator: '诗杰',
    contact: '',
    votes: 120,
    voters: Array.from({ length: 120 }, (_, i) => `voter_${i + 1}`),
    createdAt: '2025-12-18',
  },
  {
    id: 4,
    awardName: '社区之光奖',
    nomineeName: '诗杰',
    nomineeDesc: '照亮社区的温暖之光，激励他人前行',
    videoUrl: 'https://www.bilibili.com/video/BV1JS4y1k7Um/',
    bvid: 'BV1JS4y1k7Um',
    reason: '诗杰就像一束光，照亮了社区的每一个角落。他的热情、积极和正能量感染着每一个人。当有人遇到困难时，他总是第一时间伸出援手；当社区需要组织活动时，他总是冲在最前面。他不仅自己发光，更激励着其他人一起发光。在他的影响下，整个社区都变得更加温暖、更有活力。他是真正的社区之光。',
    nominator: '网名叫唐总',
    contact: '',
    votes: 116,
    voters: Array.from({ length: 116 }, (_, i) => `voter_${i + 1}`),
    createdAt: '2025-12-22',
  },
  {
    id: 5,
    awardName: '女王奖',
    nomineeName: 'Miya',
    nomineeDesc: '跨界协作推动者，连接不同领域的开放协作人',
    videoUrl: 'https://www.bilibili.com/video/BV1rq4y1t7Gd/',
    bvid: 'BV1rq4y1t7Gd',
    reason: 'Miya在社区中将不同领域、不同背景的开放协作人聚集在一起，激发跨界碰撞的火花。',
    nominator: '网名叫唐总',
    contact: '',
    votes: 100,
    voters: Array.from({ length: 100 }, (_, i) => `voter_${i + 1}`),
    createdAt: '2025-12-25',
  },
];

const OpenCollaboratorAward: FC = () => {
  const { t } = useContext(I18nContext);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'success'>('all');
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<string>('');

  // 初始化数据
  useEffect(() => {
    // 获取或创建用户ID
    let uid = localStorage.getItem('userId');
    if (!uid) {
      uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', uid);
    }
    setUserId(uid);

    // 强制使用最新的初始数据（忽略 localStorage 中的旧数据）
    setNominations(initialNominations);
    localStorage.setItem('nominations', JSON.stringify(initialNominations));
  }, []);

  const saveData = (data: Nomination[]) => {
    setNominations(data);
    localStorage.setItem('nominations', JSON.stringify(data));
  };

  const extractBVID = (url: string): string | null => {
    const match = url.match(/BV[a-zA-Z0-9]+/);
    return match ? match[0] : null;
  };

  const getBilibiliEmbed = (bvid: string): string => {
    return `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0&autoplay=0`;
  };

  const handleVote = (nominationId: number) => {
    const nomination = nominations.find((n) => n.id === nominationId);
    if (!nomination) return;

    if (nomination.voters.includes(userId)) {
      alert('你已经为这个提名投过票了！');
      return;
    }

    const willWin = nomination.votes + 1 >= 10;
    const message = willWin
      ? `确认投票吗？\n\n"${nomination.awardName}" 提名人 ${nomination.nomineeName} 即将获奖！\n投票后你需要和其他投票人共同分摊奖杯制作费用（预计每人 50-80 元）。`
      : `确认为 ${nomination.nomineeName} 投票吗？\n\n当前 ${nomination.votes} 票，还需要 ${10 - nomination.votes} 票奖项即可成立。\n投票后如果奖项成立，你需要和其他投票人共同分摊奖杯制作费用。`;

    if (!confirm(message)) return;

    const updatedNominations = nominations.map((n) =>
      n.id === nominationId
        ? { ...n, votes: n.votes + 1, voters: [...n.voters, userId] }
        : n
    );
    saveData(updatedNominations);

    if (willWin) {
      alert(`恭喜！${nomination.nomineeName} 的提名已达到 10 票，奖项正式成立！\n\n我们会尽快联系所有投票人确认费用分摊事宜。`);
    } else {
      alert(`✅ 投票成功！当前 ${nomination.votes + 1} 票`);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const videoUrl = formData.get('videoUrl') as string;
    const bvid = extractBVID(videoUrl);

    if (!bvid) {
      alert('请输入有效的B站视频链接！');
      return;
    }

    const newNomination: Nomination = {
      id: nominations.length > 0 ? Math.max(...nominations.map((n) => n.id)) + 1 : 1,
      awardName: '开放协作人奖',
      nomineeName: formData.get('nomineeName') as string,
      nomineeDesc: (formData.get('nomineeDesc') as string) || '',
      videoUrl,
      bvid,
      reason: formData.get('reason') as string,
      nominator: formData.get('nominator') as string,
      contact: (formData.get('contact') as string) || '',
      votes: 0,
      voters: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    saveData([newNomination, ...nominations]);
    form.reset();
    setShowModal(false);
    alert('✅ 提名提交成功！感谢你的参与！');

    setTimeout(() => {
      document.getElementById('nominees')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filteredNominations = nominations.filter((n) => {
    if (filter === 'pending') return n.votes < 10;
    if (filter === 'success') return n.votes >= 10;
    return true;
  });

  const winners = nominations.filter((n) => n.votes >= 10);
  const totalVotes = 666; // 固定显示

  return (
    <div className={styles.awardPage}>
      {/* Hero 区域 */}
      <section className={styles.hero}>
        <Container>
          <h1 className={styles.heroTitle}>致敬每一位开放协作者</h1>
          <p className={styles.heroDesc}>感谢那些在过去一年里给你留下深刻印象、对你有帮助的人</p>
          <Row className={styles.stats}>
            <Col xs={4} className={styles.statItem}>
              <div className={styles.statNumber}>{nominations.length}</div>
              <div className={styles.statLabel}>总提名数</div>
            </Col>
            <Col xs={4} className={styles.statItem}>
              <div className={styles.statNumber}>{winners.length}</div>
              <div className={styles.statLabel}>获奖人数</div>
            </Col>
            <Col xs={4} className={styles.statItem}>
              <div className={styles.statNumber}>{totalVotes}</div>
              <div className={styles.statLabel}>总投票数</div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 关于奖项 */}
      <section className={styles.section}>
        <Container>
          <h2 className={styles.sectionTitle}>关于奖项</h2>
          <Row>
            <Col md={4}>
              <Card className={styles.aboutCard}>
                <Card.Body className="text-center">
                  <div className={styles.icon}>🌟</div>
                  <Card.Title>奖项意义</Card.Title>
                  <Card.Text>
                    由「开源市集」社区发起，旨在表彰那些在开源协作中展现出卓越精神和无私奉献的个人。
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={styles.aboutCard}>
                <Card.Body className="text-center">
                  <div className={styles.icon}>🎯</div>
                  <Card.Title>评选标准</Card.Title>
                  <Card.Text>
                    任何在过去一年里给你留下深刻印象或对你有帮助的人，都值得被提名和表彰。
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={styles.aboutCard}>
                <Card.Body className="text-center">
                  <div className={styles.icon}>🏆</div>
                  <Card.Title>共创价值</Card.Title>
                  <Card.Text>
                    当提名获得至少10票支持，所有投票人将共同分摊费用，为获奖者制作专属奖杯。
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 倡议视频 */}
      <section className={styles.initiative}>
        <Container>
          <h2 className={styles.sectionTitle}>开放协作人奖提名倡议</h2>
          <Row className="align-items-center">
            <Col md={6}>
              <div className={styles.videoContainer}>
                <iframe
                  src="https://player.bilibili.com/player.html?bvid=BV1c44y1x7ij&page=1&high_quality=1&danmaku=0"
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.initiativeDesc}>
                <h3>为什么发起这个奖项？</h3>
                <p>
                  在开源社区中，有太多默默付出的人，他们的贡献往往被忽视。开放协作人奖希望通过社区的力量，让每一个帮助过你的人都能被看见、被感谢、被铭记。
                </p>
                <p>
                  这不仅仅是一个奖项，更是一种文化的传递——让感恩成为习惯，让协作成为力量。
                </p>
                <Button
                  variant="light"
                  size="lg"
                  onClick={() => setShowModal(true)}
                  className={styles.ctaButton}
                >
                  立即提名你心中的开放协作人 →
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 规则说明 */}
      <section className={styles.section}>
        <Container>
          <h2 className={styles.sectionTitle}>参与规则</h2>
          <Row>
            {[
              { num: 1, title: '提名', desc: '任何人都可以提名在过去一年里对自己有帮助的人，通过视频介绍提名理由' },
              { num: 2, title: '投票', desc: '社区成员可以为认同的提名投票，每人每个提名只能投一票' },
              { num: 3, title: '成立', desc: '当提名获得至少10票时，奖项正式成立，被提名人成为获奖者' },
              { num: 4, title: '奖杯', desc: '所有投票人平摊费用，共同为获奖者制作专属奖杯' },
            ].map((rule) => (
              <Col md={3} key={rule.num} className="mb-4">
                <div className={styles.ruleItem}>
                  <div className={styles.ruleNumber}>{rule.num}</div>
                  <h4>{rule.title}</h4>
                  <p>{rule.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 获奖者榜单 */}
      {winners.length > 0 && (
        <section className={styles.section} id="winners">
          <Container>
            <h2 className={styles.sectionTitle}>获奖者榜单</h2>
            <Row>
              {winners.map((winner) => (
                <Col md={6} key={winner.id} className="mb-4">
                  <Card
                    className={styles.winnerCard}
                    onClick={() => {
                      document
                        .getElementById(`nominee-${winner.id}`)
                        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  >
                    <Card.Body>
                      <Badge bg="primary" className="mb-2">
                        {winner.awardName}
                      </Badge>
                      <h3>{winner.nomineeName}</h3>
                      <div className={styles.winnerMeta}>
                        <span>提名人：{winner.nominator}</span>
                        <span className="mx-2">|</span>
                        <span>
                          投票数：<strong>{winner.votes}</strong>
                        </span>
                      </div>
                      <div className={styles.viewHint}>点击查看提名视频 →</div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* 提名展示 */}
      <section className={styles.section} id="nominees">
        <Container>
          <h2 className={styles.sectionTitle}>提名展示</h2>
          <div className={styles.filterBar}>
            {(['all', 'pending', 'success'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'primary' : 'outline-secondary'}
                onClick={() => setFilter(f)}
                className={styles.filterBtn}
              >
                {f === 'all' ? '全部' : f === 'pending' ? '进行中' : '已获奖'}
              </Button>
            ))}
          </div>
          <Row>
            {filteredNominations.length === 0 ? (
              <Col className="text-center py-5">
                <h3>暂无提名</h3>
              </Col>
            ) : (
              filteredNominations.map((nomination) => {
                const progress = Math.min((nomination.votes / 10) * 100, 100);
                const hasVoted = nomination.voters.includes(userId);
                const isWinner = nomination.votes >= 10;
                const displayVoters = nomination.voters.slice(0, 5);
                const remainingCount = Math.max(0, nomination.voters.length - 5);

                return (
                  <Col lg={6} key={nomination.id} className="mb-4" id={`nominee-${nomination.id}`}>
                    <Card className={`${styles.nomineeCard} ${isWinner ? styles.winner : ''}`}>
                      <div className={styles.videoWrapper}>
                        <iframe
                          src={getBilibiliEmbed(nomination.bvid)}
                          scrolling="no"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                      <Card.Body>
                        <Badge bg="primary" className="mb-2">
                          {nomination.awardName}
                        </Badge>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Card.Title className="mb-0">{nomination.nomineeName}</Card.Title>
                          {isWinner && (
                            <Badge bg="success" className="ms-2">
                              已获奖
                            </Badge>
                          )}
                        </div>
                        {nomination.nomineeDesc && (
                          <Card.Text className="text-muted small">{nomination.nomineeDesc}</Card.Text>
                        )}
                        <div className={styles.reason}>
                          <strong>提名理由：</strong>
                          <p>{nomination.reason}</p>
                        </div>
                        <p className="text-muted small mb-2">
                          提名人：{nomination.nominator} · {nomination.createdAt}
                        </p>
                        {nomination.voters.length > 0 && (
                          <div className={styles.votersList}>
                            <strong>投票人：</strong>
                            {displayVoters.map((voter, idx) => (
                              <Badge key={idx} bg="secondary" className="me-1">
                                {voter}
                              </Badge>
                            ))}
                            {remainingCount > 0 && (
                              <Badge bg="warning">+{remainingCount}</Badge>
                            )}
                          </div>
                        )}
                        <div className={styles.voteSection}>
                          <div className={styles.voteProgress}>
                            <div className={styles.progressBar}>
                              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                            </div>
                            <div className={styles.voteCount}>
                              <span className={styles.current}>{nomination.votes}</span> / 10 票
                              {isWinner && <span className="text-success ms-2">✓ 奖项已成立</span>}
                            </div>
                          </div>
                          <Button
                            variant={hasVoted ? 'secondary' : 'primary'}
                            disabled={hasVoted}
                            onClick={() => handleVote(nomination.id)}
                            size="sm"
                          >
                            {hasVoted ? '已投票' : '投票'}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>
          <div className="text-center mt-4">
            <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>
              提交提名
            </Button>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <Container>
          <h2 className={styles.sectionTitle}>常见问题</h2>
          <Row>
            <Col lg={8} className="mx-auto">
              {[
                {
                  q: 'Q: 谁可以参与提名？',
                  a: 'A: 任何人都可以提名在过去一年里对自己有帮助或留下深刻印象的人。',
                },
                {
                  q: 'Q: 如何制作提名视频？',
                  a: 'A: 可以用手机或电脑录制，真诚地讲述为什么要提名TA、TA做了什么让你印象深刻的事情。上传到B站后将链接粘贴到提名表单即可。',
                },
                {
                  q: 'Q: 投票后需要支付多少费用？',
                  a: 'A: 只有当提名达到10票成立后，投票人才需要分摊奖杯制作费用。具体金额会在投票时说明，通常每人十几元人民币。',
                },
                {
                  q: 'Q: 可以投多个提名吗？',
                  a: 'A: 可以。你可以为多个不同的提名投票，但每个提名只能投一票。',
                },
                {
                  q: 'Q: 奖杯会寄给获奖者吗？',
                  a: 'A: 是的。达到10票后，我们会联系获奖者确认收件地址，制作完成后寄出。',
                },
              ].map((faq, idx) => (
                <Card key={idx} className={`${styles.faqCard} mb-3`}>
                  <Card.Body>
                    <h5>{faq.q}</h5>
                    <p className="mb-0">{faq.a}</p>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      {/* 提交提名表单 Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>提交提名</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>被提名人姓名/网名 *</Form.Label>
              <Form.Control
                type="text"
                name="nomineeName"
                placeholder="请输入被提名人的姓名或网名"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>被提名人简介</Form.Label>
              <Form.Control
                as="textarea"
                name="nomineeDesc"
                rows={2}
                placeholder="简单介绍一下被提名人（选填）"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>提名视频链接 *</Form.Label>
              <Form.Control
                type="url"
                name="videoUrl"
                placeholder="B站视频链接，如：https://www.bilibili.com/video/BV1S44y1J78o/"
                required
              />
              <Form.Text className="text-muted">请上传视频到B站，然后粘贴链接</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>提名理由（文字版） *</Form.Label>
              <Form.Control
                as="textarea"
                name="reason"
                rows={5}
                placeholder="请简要说明为什么提名TA，TA在过去一年里如何帮助了你或给你留下深刻印象"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>你的姓名/网名 *</Form.Label>
              <Form.Control type="text" name="nominator" placeholder="提名人姓名" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>联系方式</Form.Label>
              <Form.Control
                type="email"
                name="contact"
                placeholder="邮箱或其他联系方式（选填）"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              提交提名
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OpenCollaboratorAward;
