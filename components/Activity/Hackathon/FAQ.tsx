import { FC } from 'react';
import { Container } from 'react-bootstrap';

import styles from './FAQ.module.less';

export type HackathonFAQItem = Record<'id' | 'question' | 'answer', string>;

export interface HackathonFAQProps {
  items: HackathonFAQItem[];
  subtitle: string;
  title: string;
}

export const HackathonFAQ: FC<HackathonFAQProps> = ({ items, subtitle, title }) => (
  <section id="faq" className={styles.section}>
    <Container>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>{subtitle}</p>
        <div className={styles.accentLine} />
      </header>

      <div className={`${styles.faqGrid} d-grid gap-3`}>
        {items.map(({ answer, id, question }) => (
          <details key={id} className={styles.faqItem}>
            <summary className={styles.faqQuestion}>{question}</summary>
            <p className={`${styles.faqAnswer} mt-3 mb-0`}>{answer}</p>
          </details>
        ))}
      </div>
    </Container>
  </section>
);
