import { TableCellValue } from 'mobx-lark';
import { FC, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';

import { LarkImage } from '../../LarkImage';
import styles from './Participants.module.less';

export interface HackathonParticipantItem {
  avatar?: TableCellValue;
  githubLink?: string;
  id: string;
  name: string;
}

export interface HackathonParticipantsProps {
  initialVisible?: number;
  participants: HackathonParticipantItem[];
  showLessLabel?: string;
  showMoreLabel?: string;
  subtitle: string;
  title: string;
}

const ParticipantCard: FC<HackathonParticipantItem> = ({ avatar, githubLink, name }) => {
  const content = (
    <>
      <LarkImage className={styles.avatar} src={avatar} alt={name} title={name} />
      <span className={styles.participantName}>{name}</span>
    </>
  );

  return githubLink ? (
    <a
      className={`${styles.participantCard} d-flex flex-column align-items-center gap-3 text-center`}
      href={githubLink}
      target="_blank"
      rel="noreferrer"
    >
      {content}
    </a>
  ) : (
    <div
      className={`${styles.participantCard} d-flex flex-column align-items-center gap-3 text-center`}
    >
      {content}
    </div>
  );
};

export const HackathonParticipants: FC<HackathonParticipantsProps> = ({
  initialVisible = 12,
  participants,
  showLessLabel,
  showMoreLabel,
  subtitle,
  title,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleParticipants = useMemo(
    () => (expanded ? participants : participants.slice(0, initialVisible)),
    [expanded, initialVisible, participants],
  );
  const hasMore = participants.length > initialVisible;

  return (
    <section className={styles.section}>
      <Container>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.sectionSubtitle}>{subtitle}</p>
          <div className={styles.accentLine} />
        </header>

        <div className={`${styles.participantCloud} d-grid gap-3`}>
          {visibleParticipants.map(participant => (
            <ParticipantCard key={participant.id} {...participant} />
          ))}
        </div>

        {hasMore && (
          <button
            type="button"
            className={`${styles.toggleButton} d-inline-flex align-items-center justify-content-center mt-3`}
            onClick={() => setExpanded(value => !value)}
          >
            {expanded ? showLessLabel || 'Show less' : showMoreLabel || 'Show more'}
          </button>
        )}
      </Container>
    </section>
  );
};
