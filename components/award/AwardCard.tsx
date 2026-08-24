import { FC, useContext } from 'react';
import { Badge, Button, Card } from 'react-bootstrap';

import { Award } from '../../models/Award';
import { I18nContext } from '../../models/Translation';
import styles from './Award.module.less';

// cspell:ignore bilibili

export const AWARD_VOTE_THRESHOLD = 10;

export const voteCountOf = ({ votes }: Pick<Award, 'votes'>) => {
  const count = Number(votes);

  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
};

const bilibiliURLOf = (value: Award['videoUrl']) => {
  try {
    const url = new URL(value?.toString() || ''),
      { hostname } = url;

    if (
      url.protocol !== 'https:' ||
      !(hostname === 'bilibili.com' || hostname.endsWith('.bilibili.com') || hostname === 'b23.tv')
    )
      return undefined;

    return url;
  } catch {
    return undefined;
  }
};

const dateTextOf = (value: Award['createdAt'], locale: string) => {
  const rawValue = value?.toString();

  if (!rawValue) return '';

  const timestamp = Number(rawValue),
    normalizedTimestamp = timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp,
    date = new Date(Number.isNaN(timestamp) ? rawValue : normalizedTimestamp),
    dateLocale = ['zh-CN', 'zh-TW', 'en-US'].includes(locale) ? locale : 'zh-CN';

  return Number.isNaN(date.valueOf()) ? rawValue : date.toLocaleDateString(dateLocale);
};

export interface AwardCardProps extends Award {
  className?: string;
}

export const AwardCard: FC<AwardCardProps> = ({ className = '', ...award }) => {
  const i18n = useContext(I18nContext),
    { t, currentLanguage } = i18n;
  const { awardName, nomineeName, nomineeDesc, videoUrl, reason, nominator, createdAt } = award,
    votes = voteCountOf(award),
    winner = votes >= AWARD_VOTE_THRESHOLD,
    videoURL = bilibiliURLOf(videoUrl),
    bilibiliId = videoURL?.pathname.match(/BV[0-9A-Za-z]{10}/)?.[0],
    progress = Math.min((votes / AWARD_VOTE_THRESHOLD) * 100, 100),
    nominee = nomineeName?.toString() || t('award_unnamed_nominee');

  return (
    <Card
      id={`award-${award.id}`}
      as="article"
      className={`${styles.nomineeCard} h-100 ${className}`}
    >
      {bilibiliId ? (
        <div className={styles.videoWrapper}>
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${bilibiliId}&page=1&high_quality=1&danmaku=0&autoplay=0`}
            title={`${t('award_nomination_video_title')}: ${nominee}`}
            loading="lazy"
            allowFullScreen
          />
        </div>
      ) : videoURL ? (
        <div className={`${styles.videoFallback} d-flex align-items-center justify-content-center`}>
          <Button href={videoURL.href} target="_blank" rel="noreferrer" variant="light">
            {t('award_watch_nomination_video')}
          </Button>
        </div>
      ) : null}

      <Card.Body className="d-flex flex-column">
        <div className="mb-2 d-flex align-items-start justify-content-between gap-2">
          <Badge bg="primary">{awardName?.toString() || t('open_collaborator_award')}</Badge>
          {winner && <Badge bg="success">{t('award_recognized')}</Badge>}
        </div>

        <Card.Title as="h3">{nominee}</Card.Title>
        {nomineeDesc && <Card.Text className="text-muted">{nomineeDesc.toString()}</Card.Text>}

        {reason && (
          <div className={styles.reason}>
            <strong>{t('award_nomination_reason')}</strong>
            <p className="mb-0 mt-2">{reason.toString()}</p>
          </div>
        )}

        <footer className="mt-auto pt-3">
          <p className="text-muted small">
            {t('award_nominated_by')}: {nominator?.toString() || t('award_anonymous')}
            {createdAt && ` · ${dateTextOf(createdAt, currentLanguage)}`}
          </p>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <p className="mb-0 mt-2 small text-muted">
            <strong className={styles.voteCount}>{votes}</strong> / {AWARD_VOTE_THRESHOLD}{' '}
            {t('award_support_count')}
          </p>
        </footer>
      </Card.Body>
    </Card>
  );
};
