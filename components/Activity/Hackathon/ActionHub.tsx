import type { FC, PropsWithChildren } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { HackathonHeroAction } from './Hero';
import styles from './ActionHub.module.less';

export interface HackathonActionHubEntry {
  count: number;
  description: string;
  eyebrow: string;
  links: HackathonHeroAction[];
  title: string;
}

export interface HackathonActionHubProps {
  entries: HackathonActionHubEntry[];
  facts: string[];
  primaryAction?: HackathonHeroAction;
  primaryDescription: string;
  primaryTitle: string;
  subtitle: string;
  title: string;
}

export const HackathonActionHubLink: FC<{
  action: HackathonHeroAction;
  variant: 'ghost' | 'primary';
}> = ({ action, variant }) => (
  <a
    className={variant === 'primary' ? styles.actionButton : styles.actionButtonGhost}
    href={action.href}
    {...(action.external && { target: '_blank', rel: 'noreferrer' })}
  >
    {action.label}
  </a>
);

const ActionEntryCard: FC<{ entry: HackathonActionHubEntry; step: string }> = ({ entry, step }) => (
  <article className={styles.entryCard}>
    <span className={styles.entryStep}>
      {step} · {entry.eyebrow}
    </span>
    <h4 className="mt-2 mb-2">{entry.title}</h4>
    <p>{entry.description}</p>

    <div className={`${styles.entryMetaRow} d-flex flex-wrap gap-2 my-3`}>
      <span className={`${styles.entryMeta} d-inline-flex align-items-center`}>{entry.count}</span>
      <span className={`${styles.entryMeta} d-inline-flex align-items-center`}>
        {entry.eyebrow}
      </span>
    </div>

    <nav className={`${styles.entryLinks} d-flex flex-wrap gap-3`} aria-label={entry.title}>
      {entry.links.map(link => (
        <a
          key={`${link.label}-${link.href}`}
          className={`${styles.entryLink} d-inline-flex align-items-center`}
          href={link.href}
          {...(link.external && { target: '_blank', rel: 'noreferrer' })}
        >
          {link.label}
        </a>
      ))}
    </nav>
  </article>
);

export const HackathonActionHub: FC<PropsWithChildren<HackathonActionHubProps>> = ({
  children,
  entries,
  facts,
  primaryAction,
  primaryDescription,
  primaryTitle,
  subtitle,
  title,
}) => (
  <section id="entry-hub" className={styles.section}>
    <Container>
      <div className={styles.registerWrap}>
        <article className={styles.registerCard}>
          <div className={styles.registerCardInner}>
            <p className={`${styles.regEyebrow} mb-1`}>{title}</p>
            <h2 className={`${styles.regTitle} mt-2`}>{primaryTitle}</h2>
            <p className={`${styles.regDesc} mt-3 mb-4`}>{primaryDescription}</p>

            <nav className={`${styles.regActions} d-flex flex-wrap gap-3`} aria-label={title}>
              {primaryAction && <HackathonActionHubLink action={primaryAction} variant="primary" />}
              {children}
            </nav>

            <ul className={`list-unstyled ${styles.regFacts} d-flex flex-wrap gap-2 mt-4`}>
              {facts.map(fact => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        </article>

        <div className={styles.entryHub}>
          <header className={`${styles.entryHubHead} mb-4`}>
            <p className={`${styles.entryEyebrow} mb-1`}>{subtitle}</p>
            <h3 className={`${styles.entryTitle} mt-2`}>{title}</h3>
          </header>

          <Row as="ol" className="list-unstyled g-3 mb-0">
            {entries.map((entry, index) => (
              <Col as="li" key={entry.title} md={6}>
                <ActionEntryCard entry={entry} step={String(index + 1).padStart(2, '0')} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </Container>
  </section>
);
