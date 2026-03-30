import { TableCellValue } from 'mobx-lark';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { LarkImage } from '../../LarkImage';
import styles from './HackathonAwards.module.less';

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

export interface HackathonAwardsProps {
  organizations: HackathonOrganizationItem[];
  prizes: HackathonPrizeItem[];
  subtitle: string;
  supportDescription: string;
  supportEyebrow: string;
  supportTitle: string;
  title: string;
}

const PrizeCard: FC<HackathonPrizeItem> = ({
  description,
  image,
  meta,
  tier,
  title,
}) => (
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

const OrganizationLogo: FC<HackathonOrganizationItem> = ({
  href,
  logo,
  name,
}) => {
  const imageNode = (
    <LarkImage src={logo} alt={name} className={styles.partnerLogo} />
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={name}
      className={styles.partnerLink}
    >
      {imageNode}
    </a>
  ) : (
    <div className={styles.partnerLink} title={name}>
      {imageNode}
    </div>
  );
};

export const HackathonAwards: FC<HackathonAwardsProps> = ({
  organizations,
  prizes,
  subtitle,
  supportDescription,
  supportEyebrow,
  supportTitle,
  title,
}) => (
  <section className={styles.section}>
    <Container>
      {prizes[0] && (
        <>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <p className={styles.sectionSubtitle}>{subtitle}</p>
            <div className={styles.accentLine} />
          </header>

          <div className={styles.awardsGrid}>
            {prizes.map((prize) => (
              <PrizeCard key={prize.id} {...prize} />
            ))}
          </div>
        </>
      )}

      {organizations[0] && (
        <div className={styles.supportCard}>
          <div className={styles.supportCopy}>
            <p className={styles.supportEyebrow}>{supportEyebrow}</p>
            <h3 className={styles.supportTitle}>{supportTitle}</h3>
            <p className={styles.supportDescription}>{supportDescription}</p>
          </div>

          <nav className={styles.partnerGrid} aria-label={supportEyebrow}>
            {organizations.map((organization) => (
              <OrganizationLogo key={organization.id} {...organization} />
            ))}
          </nav>
        </div>
      )}
    </Container>
  </section>
);
