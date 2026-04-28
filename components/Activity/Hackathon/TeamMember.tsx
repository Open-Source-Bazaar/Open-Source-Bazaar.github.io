import { Avatar } from 'idea-react';
import { TableCellUser } from 'mobx-lark';
import { FC } from 'react';
import { Card } from 'react-bootstrap';

import { Member } from '../../../models/Hackathon';
import styles from './TeamMember.module.less';

export const TeamMemberCard: FC<Member> = ({ person, githubAccount, summary, skills }) => {
  const member = person as TableCellUser;
  const githubName = githubAccount as string;
  const memberSummary = summary as string;
  const memberSkills = (skills as string[]).slice(0, 6);

  return (
    <Card className={`${styles.card} h-100`} body>
      <div className="d-flex align-items-center gap-3">
        <Avatar className={styles.avatar} src={member?.avatar_url} />
        <div>
          <h3 className={styles.name}>{member?.name || '-'}</h3>

          {githubName && (
            <a
              className={styles.link}
              href={`https://github.com/${githubName}`}
              target="_blank"
              rel="noreferrer"
            >
              @{githubName}
            </a>
          )}
        </div>
      </div>

      {memberSummary && <p className={styles.summary}>{memberSummary}</p>}

      {memberSkills[0] && (
        <ul className="d-flex flex-wrap gap-2 mt-3 mb-0 p-0 list-unstyled">
          {memberSkills.map(skill => (
            <li key={skill} className={styles.skill}>
              {skill}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
