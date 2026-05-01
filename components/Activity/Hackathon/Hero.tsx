import { TableCellValue } from 'mobx-lark';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { Container } from 'react-bootstrap';
import { TimeUnit } from 'idea-react';

import { Agenda } from '../../../models/Hackathon';
import { LarkImage } from '../../LarkImage';
import styles from './Hero.module.less';

const AgendaCountdown = dynamic(() => import('./AgendaCountdown'), { ssr: false });

export type HackathonHeroNavItem = Record<'label' | 'href', string>;

export interface HackathonHeroAction extends HackathonHeroNavItem {
  external?: boolean;
}

export type HackathonHeroCard = Record<'title' | 'description' | 'eyebrow', string>;

export interface HackathonHeroProps extends Record<
  | `visual${'Kicker' | 'Title' | 'Copy' | 'Chip'}`
  | 'name'
  | 'subtitle'
  | 'description'
  | 'locationText'
  | 'imageFallback',
  string
> {
  agendaItems: Agenda[];
  badges: string[];
  bottomCard?: HackathonHeroCard;
  chips?: string[];
  countdownUnits: TimeUnit[];
  endTime?: TableCellValue;
  image?: TableCellValue;
  startTime?: TableCellValue;
  navigation: HackathonHeroNavItem[];
  primaryAction: HackathonHeroAction;
  secondaryAction: HackathonHeroAction;
  topCard?: HackathonHeroCard;
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
    className={variant === 'primary' ? styles.actionButton : styles.actionButtonGhost}
    href={action.href}
    {...(action.external && { target: '_blank', rel: 'noreferrer' })}
  >
    {action.label}
  </a>
);

const NavLink: FC<{ item: HackathonHeroNavItem }> = ({ item }) => (
  <a className={`${styles.headerNavLink} d-none d-lg-inline`} href={item.href}>
    {item.label}
  </a>
);

const FloatingCard: FC<{
  card: HackathonHeroCard;
  position: 'bottom' | 'top';
}> = ({ card, position }) => (
  <div
    className={`${styles.heroFloatingCard} mt-3 mt-md-0 ${position === 'top' ? styles.heroFloatingCardTop : styles.heroFloatingCardBottom}`}
  >
    <span className={styles.floatingLabel}>{card.eyebrow}</span>
    <strong>{card.title}</strong>
    <p>{card.description}</p>
  </div>
);

const splitHeroTitle = (name: string, subtitle: string) => {
  const segments = name.split(/\s+/).filter(Boolean);

  if (segments.length < 3)
    return {
      primary: name,
      secondary: subtitle,
    };

  return {
    primary: segments.slice(0, Math.max(1, segments.length - 2)).join(' '),
    secondary: segments.slice(-2).join(' '),
  };
};

export const HackathonHero: FC<HackathonHeroProps> = ({
  agendaItems,
  badges,
  bottomCard,
  chips,
  countdownUnits,
  description,
  endTime,
  image,
  imageFallback,
  locationText,
  name,
  navigation,
  primaryAction,
  secondaryAction,
  startTime,
  subtitle,
  topCard,
  visualChip,
  visualCopy,
  visualKicker,
  visualTitle,
}) => {
  const title = splitHeroTitle(name, subtitle);

  return (
    <section id="top" className={styles.hero}>
      <header className={styles.siteHeader}>
        <Container>
          <div
            className={`${styles.headerContainer} d-flex flex-wrap flex-md-nowrap justify-content-between align-items-center gap-3 py-3`}
          >
            <a className={`${styles.logoText} text-nowrap`} href="#top">
              {name}
            </a>

            <nav
              className={`${styles.headerNav} d-flex justify-content-between justify-content-md-start align-items-center gap-3`}
              aria-label={subtitle}
            >
              {navigation.map(item => (
                <NavLink key={`${item.label}-${item.href}`} item={item} />
              ))}
              <HeroLink action={primaryAction} variant="primary" />
            </nav>
          </div>
        </Container>
      </header>

      <Container>
        <div className={styles.heroInner}>
          <div className={`${styles.heroContent} d-flex flex-column pt-3 pt-xl-4`}>
            <ul className={`list-unstyled ${styles.heroEyebrow} d-flex flex-wrap gap-3 m-0`}>
              {badges.map((badge, index) => (
                <li
                  key={`${badge}-${index}`}
                  className={`${styles.heroBadge} d-inline-flex align-items-center ${BadgeToneClass[index % BadgeToneClass.length]}`}
                >
                  {badge}
                </li>
              ))}
            </ul>

            <h1 className={`${styles.title} d-flex flex-column mb-0`}>
              <span className={styles.heroTitlePrimary}>{title.primary}</span>
              <span className={styles.heroTitleAccent}>{title.secondary}</span>
              <span className={styles.heroTitleSecondary}>{subtitle}</span>
            </h1>

            <p className={styles.description}>{description}</p>

            <AgendaCountdown
              agendaItems={agendaItems}
              endTime={endTime}
              startTime={startTime}
              units={countdownUnits}
            />

            <nav className="d-flex flex-wrap gap-2 gap-md-3" aria-label={subtitle}>
              <HeroLink action={primaryAction} variant="primary" />
              <HeroLink action={secondaryAction} variant="ghost" />
            </nav>

            {chips?.[0] && (
              <ul
                className={`list-unstyled ${styles.heroStats} d-flex flex-wrap gap-2 gap-md-3 m-0`}
              >
                {chips.map(chip => (
                  <li key={chip} className={`${styles.statChip} d-inline-flex align-items-center`}>
                    {chip}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`${styles.heroVisual} pt-3 pt-xl-4 d-flex d-md-block flex-column`}>
            <div className={styles.heroVisualCard}>
              <div className={`${styles.heroVisualHead} d-flex justify-content-between gap-3`}>
                <span className={styles.visualKicker}>{visualKicker}</span>
                <span className={styles.visualChip}>{visualChip}</span>
              </div>

              <figure className={styles.heroImageFrame}>
                <div className={styles.mascotGlow} />

                {image ? (
                  <LarkImage src={image} alt={name} className="w-100 h-100 object-fit-cover" />
                ) : (
                  <div
                    className={`${styles.heroImageFallback} d-flex justify-content-center align-items-center`}
                  >
                    {imageFallback}
                  </div>
                )}
              </figure>

              <div className={styles.heroVisualFoot}>
                <p className={styles.heroVisualTitle}>{locationText}</p>
                <p className={`${styles.heroVisualCopy} m-0`}>{visualTitle}</p>
                <p className={`${styles.heroVisualDescription} m-0`}>{visualCopy}</p>
              </div>
            </div>

            {topCard && <FloatingCard card={topCard} position="top" />}
            {bottomCard && <FloatingCard card={bottomCard} position="bottom" />}
          </div>
        </div>
      </Container>
    </section>
  );
};
