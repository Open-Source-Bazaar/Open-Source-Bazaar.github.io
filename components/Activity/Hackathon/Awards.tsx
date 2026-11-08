import { Container } from 'idea-react';
import { TableCellValue } from 'mobx-lark';
import { FC } from 'react';

import { LarkImage } from '../../LarkImage';
import styles from './Awards.module.less';
import type { HackathonHeroAction } from './Hero';

export interface HackathonAwardsMeta<Value = string> {
  label: string;
  value: Value;
}

export interface HackathonPrizeItem {
  description: string;
  id: string;
  image?: TableCellValue;
  meta: HackathonAwardsMeta[];
  tier: string;
  title: string;
}

export interface HackathonOrganizationItem {
  href?: string;
  id: string;
  logo?: TableCellValue;
  name: string;
}

export type HackathonJudgingCriterion = Record<'id' | 'title' | 'weight' | 'description', string>;

export interface HackathonAwardsProps {
  criteria?: HackathonJudgingCriterion[];
  organizations: HackathonOrganizationItem[];
  prizes: HackathonPrizeItem[];
  subtitle: string;
  supportAction?: HackathonHeroAction;
  supportDescription: string;
  supportEyebrow: string;
  supportTitle: string;
  title: string;
}

const PrizeCard: FC<HackathonPrizeItem> = ({ description, image, meta, tier, title }) => (
  <article className={styles.badgeTile}>
    {image && (
      <div className={styles.badgeArtWrap}>
        <LarkImage src={image} alt={title} className={styles.badgeArt} />
      </div>
    )}

    <div className={styles.badgeTileBody}>
      <span className={styles.badgeTierLabel}>{tier}</span>
      <h3 className={styles.badgeTileTitle}>{title}</h3>
      <p className={styles.badgeTileCopy}>{description}</p>

      <dl className={styles.prizeMeta}>
        {meta.map(({ label, value }) => (
          <div key={`${label}-${value}`}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </article>
);

const OrganizationLogo: FC<HackathonOrganizationItem> = ({ href, logo, name }) => {
  const imageNode = <LarkImage src={logo} alt={name} className={styles.partnerLogo} />;

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={name}
      className={`${styles.partnerLink} d-flex justify-content-center align-items-center`}
    >
      {imageNode}
    </a>
  ) : (
    <div
      className={`${styles.partnerLink} d-flex justify-content-center align-items-center`}
      title={name}
    >
      {imageNode}
    </div>
  );
};

export const HackathonAwards: FC<HackathonAwardsProps> = ({
  criteria,
  organizations,
  prizes,
  subtitle,
  supportAction,
  supportDescription,
  supportEyebrow,
  supportTitle,
  title,
}) => (
  <section id="awards" className={styles.section}>
    <Container>
      {prizes[0] && (
        <>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <p className={styles.sectionSubtitle}>{subtitle}</p>
            <div className={styles.accentLine} />
          </header>

          <div className={`${styles.awardsGrid} gap-5`}>
            {prizes.map(prize => (
              <PrizeCard key={prize.id} {...prize} />
            ))}
          </div>

          {criteria?.[0] && (
            <article className={`${styles.judgingCard} mt-7`}>
              <h3 className={`${styles.judgingTitle} mb-5`}>{subtitle}</h3>

              <ul className={`list-unstyled ${styles.criteriaGrid}`}>
                {criteria.map(({ description, id, title, weight }) => (
                  <li key={id} className={`${styles.criterion} d-grid align-items-start gap-5`}>
                    <span className={styles.criterionWeight}>{weight}</span>
                    <div>
                      <strong className={styles.criterionTitle}>{title}</strong>
                      <p className={`${styles.criterionDescription} mt-3 mb-0`}>{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </>
      )}

      {organizations[0] && (
        <div className={`${styles.supportCard} mt-7`}>
          <div className={`${styles.supportCopy} d-flex flex-column justify-content-center`}>
            <p className={`${styles.supportEyebrow} mb-1`}>{supportEyebrow}</p>
            <h3 className={`${styles.supportTitle} mt-3`}>{supportTitle}</h3>
            <p className={styles.supportDescription}>{supportDescription}</p>
          </div>

          <nav className={styles.partnerGrid} aria-label={supportEyebrow}>
            {organizations.map(organization => (
              <OrganizationLogo key={organization.id} {...organization} />
            ))}
          </nav>

          {supportAction && (
            <a
              className={`${styles.supportLink} d-inline-flex align-items-center mt-3`}
              href={supportAction.href}
              {...(supportAction.external && { target: '_blank', rel: 'noreferrer' })}
            >
              {supportAction.label}
            </a>
          )}
        </div>
      )}
    </Container>
  </section>
);
