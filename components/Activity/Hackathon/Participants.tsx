import { TableCellValue } from 'mobx-lark';
import { FC } from 'react';
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
  participants: HackathonParticipantItem[];
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
    <a className={styles.participantCard} href={githubLink} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <div className={styles.participantCard}>{content}</div>
  );
};

export const HackathonParticipants: FC<HackathonParticipantsProps> = ({
  participants,
  subtitle,
  title,
}) => (
  <section className={styles.section}>
    <Container>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>{subtitle}</p>
        <div className={styles.accentLine} />
      </header>

      <div className={styles.participantCloud}>
        {participants.map(participant => (
          <ParticipantCard key={participant.id} {...participant} />
        ))}
      </div>
    </Container>
  </section>
);
