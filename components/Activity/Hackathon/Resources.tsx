import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import type { HackathonAwardsMeta } from './Awards';
import styles from './Resources.module.less';

export interface HackathonTemplateItem {
  description: string;
  id: string;
  languages: string[];
  previewLabel: string;
  previewUrl?: string;
  sourceLabel: string;
  sourceUrl?: string;
  tags: string[];
  title: string;
}

export interface HackathonProjectMeta extends HackathonAwardsMeta {
  valueHref?: string;
}

export interface HackathonProjectItem {
  description: string;
  id: string;
  link: string;
  meta: HackathonProjectMeta[];
  score: string;
  title: string;
}

export interface HackathonResourcesProps {
  projectItems: HackathonProjectItem[];
  projectSubtitle: string;
  projectTitle: string;
  templateItems: HackathonTemplateItem[];
  templateSubtitle: string;
  templateTitle: string;
}

const TemplateCard: FC<HackathonTemplateItem> = ({
  description,
  languages,
  previewLabel,
  previewUrl,
  sourceLabel,
  sourceUrl,
  tags,
  title,
}) => (
  <article className={styles.resourceCard}>
    <div className={styles.resourceHead}>
      <h3 className={styles.resourceTitle}>{title}</h3>
    </div>
    <p className={styles.resourceDescription}>{description}</p>

    <ul className={`list-unstyled ${styles.topicList}`}>
      {languages.map(language => (
        <li key={language} className={styles.topicChip}>
          {language}
        </li>
      ))}
      {tags.map(tag => (
        <li key={tag} className={styles.topicChipMuted}>
          {tag}
        </li>
      ))}
    </ul>

    <nav className={styles.resourceLinks} aria-label={title}>
      {sourceUrl && (
        <a className={styles.entryLink} href={sourceUrl} target="_blank" rel="noreferrer">
          {sourceLabel}
        </a>
      )}
      {previewUrl && (
        <a className={styles.entryLink} href={previewUrl} target="_blank" rel="noreferrer">
          {previewLabel}
        </a>
      )}
    </nav>
  </article>
);

const ProjectCard: FC<HackathonProjectItem> = ({ description, link, meta, score, title }) => (
  <article className={styles.projectCard}>
    <div className={styles.projectTop}>
      <hgroup className={styles.projectHead}>
        <h3 className={styles.projectTitle}>
          <a href={link}>{title}</a>
        </h3>
        {description && <p className={styles.projectSummary}>{description}</p>}
      </hgroup>
      <div className={styles.scoreCircle}>{score}</div>
    </div>

    <dl className={styles.projectMeta}>
      {meta.map(({ label, value, valueHref }) => (
        <div key={`${label}-${value}`}>
          <dt>{label}</dt>
          <dd>{valueHref ? <a href={valueHref}>{value}</a> : value}</dd>
        </div>
      ))}
    </dl>
  </article>
);

export const HackathonResources: FC<HackathonResourcesProps> = ({
  projectItems,
  projectSubtitle,
  projectTitle,
  templateItems,
  templateSubtitle,
  templateTitle,
}) => (
  <section className={styles.section}>
    <Container>
      {templateItems[0] && (
        <>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{templateTitle}</h2>
            <p className={styles.sectionSubtitle}>{templateSubtitle}</p>
            <div className={styles.accentLine} />
          </header>

          <Row className="g-3">
            {templateItems.map(template => (
              <Col key={template.id} md={6} xl={4}>
                <TemplateCard {...template} />
              </Col>
            ))}
          </Row>
        </>
      )}

      {projectItems[0] && (
        <>
          <header className={`${styles.sectionHeader} ${styles.projectHeader}`}>
            <h2 className={styles.sectionTitle}>{projectTitle}</h2>
            <p className={styles.sectionSubtitle}>{projectSubtitle}</p>
            <div className={styles.accentLine} />
          </header>

          <Row className="g-3">
            {projectItems.map(project => (
              <Col key={project.id} md={6} xl={4}>
                <ProjectCard {...project} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  </section>
);
