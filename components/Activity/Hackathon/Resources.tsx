import { FC, useMemo, useState } from 'react';
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

export interface HackathonResourcesProps extends Record<
  `project${'Subtitle' | 'Title'}` | `template${'Subtitle' | 'Title'}`,
  string
> {
  projectInitialVisible?: number;
  projectItems: HackathonProjectItem[];
  showLessLabel?: string;
  showMoreLabel?: string;
  templateInitialVisible?: number;
  templateItems: HackathonTemplateItem[];
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
    <div
      className={`${styles.resourceHead} d-flex justify-content-between align-items-start gap-3`}
    >
      <h3 className={styles.resourceTitle}>{title}</h3>
    </div>
    <p className={`${styles.resourceDescription} mt-3 mb-3`}>{description}</p>

    <ul className={`list-unstyled ${styles.topicList} d-flex flex-wrap gap-2 mb-3`}>
      {languages.map(language => (
        <li key={language} className={`${styles.topicChip} d-inline-flex align-items-center`}>
          {language}
        </li>
      ))}
      {tags.map(tag => (
        <li key={tag} className={`${styles.topicChipMuted} d-inline-flex align-items-center`}>
          {tag}
        </li>
      ))}
    </ul>

    <nav className={`${styles.resourceLinks} d-flex flex-wrap gap-3`} aria-label={title}>
      {sourceUrl && (
        <a
          className={`${styles.entryLink} d-inline-flex align-items-center`}
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          {sourceLabel}
        </a>
      )}
      {previewUrl && (
        <a
          className={`${styles.entryLink} d-inline-flex align-items-center`}
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
        >
          {previewLabel}
        </a>
      )}
    </nav>
  </article>
);

const ProjectCard: FC<HackathonProjectItem> = ({ description, link, meta, score, title }) => (
  <article className={styles.projectCard}>
    <div className={`${styles.projectTop} d-flex justify-content-between align-items-start gap-3`}>
      <hgroup className={`${styles.projectHead} d-grid gap-3`}>
        <h3 className={styles.projectTitle}>
          <a href={link}>{title}</a>
        </h3>
        {description && <p className={`${styles.projectSummary} mt-0 mb-0`}>{description}</p>}
      </hgroup>
      <div
        className={`${styles.scoreCircle} d-inline-flex justify-content-center align-items-center`}
      >
        {score}
      </div>
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
  projectInitialVisible = 3,
  projectItems,
  showLessLabel,
  showMoreLabel,
  templateInitialVisible = 6,
  projectSubtitle,
  projectTitle,
  templateItems,
  templateSubtitle,
  templateTitle,
}) => {
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const visibleTemplates = useMemo(
    () => (templatesExpanded ? templateItems : templateItems.slice(0, templateInitialVisible)),
    [templateInitialVisible, templateItems, templatesExpanded],
  );
  const visibleProjects = useMemo(
    () => (projectsExpanded ? projectItems : projectItems.slice(0, projectInitialVisible)),
    [projectInitialVisible, projectItems, projectsExpanded],
  );
  const hasMoreTemplates = templateItems.length > templateInitialVisible;
  const hasMoreProjects = projectItems.length > projectInitialVisible;

  return (
    <section id="projects" className={styles.section}>
      <Container>
        {templateItems[0] && (
          <>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{templateTitle}</h2>
              <p className={styles.sectionSubtitle}>{templateSubtitle}</p>
              <div className={styles.accentLine} />
            </header>

            <Row className="g-3">
              {visibleTemplates.map(template => (
                <Col key={template.id} md={6} xl={4}>
                  <TemplateCard {...template} />
                </Col>
              ))}
            </Row>

            {hasMoreTemplates && (
              <button
                type="button"
                className={`${styles.toggleButton} d-inline-flex align-items-center justify-content-center mt-3`}
                onClick={() => setTemplatesExpanded(value => !value)}
              >
                {templatesExpanded ? showLessLabel || 'Show less' : showMoreLabel || 'Show more'}
              </button>
            )}
          </>
        )}

        {projectItems[0] && (
          <>
            <header className={`${styles.sectionHeader} mt-5`}>
              <h2 className={styles.sectionTitle}>{projectTitle}</h2>
              <p className={styles.sectionSubtitle}>{projectSubtitle}</p>
              <div className={styles.accentLine} />
            </header>

            <Row className="g-3">
              {visibleProjects.map(project => (
                <Col key={project.id} md={6} xl={4}>
                  <ProjectCard {...project} />
                </Col>
              ))}
            </Row>

            {hasMoreProjects && (
              <button
                type="button"
                className={`${styles.toggleButton} d-inline-flex align-items-center justify-content-center mt-3`}
                onClick={() => setProjectsExpanded(value => !value)}
              >
                {projectsExpanded ? showLessLabel || 'Show less' : showMoreLabel || 'Show more'}
              </button>
            )}
          </>
        )}
      </Container>
    </section>
  );
};
