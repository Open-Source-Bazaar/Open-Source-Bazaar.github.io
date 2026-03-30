import { TableCellValue } from 'mobx-lark';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { LarkImage } from '../../LarkImage';
import type { HackathonAwardsMeta } from './HackathonAwards';
import styles from './HackathonHero.module.less';

export interface HackathonHeroAction {
  external?: boolean;
  href: string;
  label: string;
}

export interface HackathonHeroCard {
  description: string;
  eyebrow: string;
  title: string;
}

export type HackathonHeroStat = HackathonAwardsMeta<number>;

export interface HackathonHeroProps {
  badges: string[];
  bottomCard?: HackathonHeroCard;
  description: string;
  image?: TableCellValue;
  imageFallback: string;
  locationText: string;
  name: string;
  primaryAction: HackathonHeroAction;
  secondaryAction: HackathonHeroAction;
  stats: HackathonHeroStat[];
  subtitle: string;
  topCard?: HackathonHeroCard;
  visualChip: string;
  visualCopy: string;
  visualKicker: string;
  visualTitle: string;
}

const BadgeToneClass = [
  styles.heroBadgeCyan,
  styles.heroBadgeGold,
  styles.heroBadgeGreen,
  styles.heroBadgeRose,
];

const HeroLink: FC<{
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

const FloatingCard: FC<{
  card: HackathonHeroCard;
  position: 'bottom' | 'top';
}> = ({ card, position }) => (
  <div
    className={`${styles.heroFloatingCard} ${position === 'top' ? styles.heroFloatingCardTop : styles.heroFloatingCardBottom}`}
  >
    <span className={styles.floatingLabel}>{card.eyebrow}</span>
    <strong>{card.title}</strong>
    <p>{card.description}</p>
  </div>
);

export const HackathonHero: FC<HackathonHeroProps> = ({
  badges,
  bottomCard,
  description,
  image,
  imageFallback,
  locationText,
  name,
  primaryAction,
  secondaryAction,
  stats,
  subtitle,
  topCard,
  visualChip,
  visualCopy,
  visualKicker,
  visualTitle,
}) => (
  <section className={styles.hero}>
    <Container>
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <ul className={`list-unstyled ${styles.heroEyebrow}`}>
            {badges.map((badge, index) => (
              <li
                key={`${badge}-${index}`}
                className={`${styles.heroBadge} ${BadgeToneClass[index % BadgeToneClass.length]}`}
              >
                {badge}
              </li>
            ))}
          </ul>

          <h1 className={styles.title}>
            <span className={styles.heroTitlePrimary}>{name}</span>
            <span className={styles.heroTitleSecondary}>{subtitle}</span>
          </h1>

          <p className={styles.description}>{description}</p>

          <nav className={styles.heroActions} aria-label={subtitle}>
            <HeroLink action={primaryAction} variant="primary" />
            <HeroLink action={secondaryAction} variant="ghost" />
          </nav>

          <ul className={`list-unstyled ${styles.heroStats}`}>
            {stats.map(({ label, value }) => (
              <li key={label} className={styles.statChip}>
                <strong>{value}</strong>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroVisualCard}>
            <div className={styles.heroVisualHead}>
              <span className={styles.visualKicker}>{visualKicker}</span>
              <span className={styles.visualChip}>{visualChip}</span>
            </div>

            <figure className={styles.heroImageFrame}>
              <div className={styles.mascotGlow} />

              {image ? (
                <LarkImage
                  src={image}
                  alt={name}
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <div className={styles.heroImageFallback}>{imageFallback}</div>
              )}
            </figure>

            <div className={styles.heroVisualFoot}>
              <p className={styles.heroVisualTitle}>{locationText}</p>
              <p className={styles.heroVisualCopy}>{visualTitle}</p>
              <p className={styles.heroVisualDescription}>{visualCopy}</p>
            </div>
          </div>

          {topCard && <FloatingCard card={topCard} position="top" />}
          {bottomCard && <FloatingCard card={bottomCard} position="bottom" />}
        </div>
      </div>
    </Container>
  </section>
);
