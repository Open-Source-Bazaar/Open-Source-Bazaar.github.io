import { FC, type PropsWithChildren } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { HackathonHeroAction } from './HackathonHero';
import styles from './HackathonActionHub.module.less';

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
    className={
      variant === 'primary' ? styles.actionButton : styles.actionButtonGhost
    }
    href={action.href}
    {...(action.external && { target: '_blank', rel: 'noreferrer' })}
  >
    {action.label}
  </a>
);

const ActionEntryCard: FC<{ entry: HackathonActionHubEntry; step: string }> = ({
  entry,
  step,
}) => (
  <article className={styles.entryCard}>
    <span className={styles.entryStep}>
      {step} · {entry.eyebrow}
    </span>
    <h4>{entry.title}</h4>
    <p>{entry.description}</p>

    <div className={styles.entryMetaRow}>
      <span className={styles.entryMeta}>{entry.count}</span>
      <span className={styles.entryMeta}>{entry.eyebrow}</span>
    </div>

    <nav className={styles.entryLinks} aria-label={entry.title}>
      {entry.links.map((link) => (
        <a
          key={`${link.label}-${link.href}`}
          className={styles.entryLink}
          href={link.href}
          {...(link.external && { target: '_blank', rel: 'noreferrer' })}
        >
          {link.label}
        </a>
      ))}
    </nav>
  </article>
);

export const HackathonActionHub: FC<
  PropsWithChildren<HackathonActionHubProps>
> = ({
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
            <p className={styles.regEyebrow}>{title}</p>
            <h2 className={styles.regTitle}>{primaryTitle}</h2>
            <p className={styles.regDesc}>{primaryDescription}</p>

            <nav className={styles.regActions} aria-label={title}>
              {primaryAction && (
                <HackathonActionHubLink
                  action={primaryAction}
                  variant="primary"
                />
              )}
              {children}
            </nav>

            <ul className={`list-unstyled ${styles.regFacts}`}>
              {facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        </article>

        <div className={styles.entryHub}>
          <header className={styles.entryHubHead}>
            <p className={styles.entryEyebrow}>{subtitle}</p>
            <h3 className={styles.entryTitle}>{title}</h3>
          </header>

          <Row as="ol" className="list-unstyled g-3 mb-0">
            {entries.map((entry, index) => (
              <Col as="li" key={entry.title} md={6}>
                <ActionEntryCard
                  entry={entry}
                  step={String(index + 1).padStart(2, '0')}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </Container>
  </section>
);
