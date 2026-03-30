import {
  BiTableSchema,
  TableCellLocation,
  TableCellUser,
  TableCellValue,
  TableFormView,
} from "mobx-lark";
import { observer } from "mobx-react";
import Link from "next/link";
import { cache, compose, errorLogger } from "next-ssr-middleware";
import { FC, useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { formatDate } from "web-utility";

import { LarkImage } from "../../components/LarkImage";
import { PageHead } from "../../components/Layout/PageHead";
import { Activity, ActivityModel } from "../../models/Activity";
import {
  Agenda,
  AgendaModel,
  Organization,
  OrganizationModel,
  Person,
  PersonModel,
  Prize,
  PrizeModel,
  Project,
  ProjectModel,
  Template,
  TemplateModel,
} from "../../models/Hackathon";
import { I18nContext, I18nKey } from "../../models/Translation";
import styles from "../../styles/Hackathon.module.less";

const RequiredTableKeys = [
  "Person",
  "Organization",
  "Agenda",
  "Prize",
  "Template",
  "Project",
] as const;

type RequiredTableKey = (typeof RequiredTableKeys)[number];

export const getServerSideProps = compose<{ id: string }>(
  cache(),
  errorLogger,
  async ({ params }) => {
    const activity = await new ActivityModel().getOne(params!.id);
    const schema = activity.databaseSchema as
      | Partial<BiTableSchema>
      | undefined;
    const tableIdMap = schema?.tableIdMap as
      | Partial<Record<RequiredTableKey, string>>
      | undefined;

    if (!schema?.appId || !tableIdMap) return { notFound: true, props: {} };

    for (const key of RequiredTableKeys)
      if (!tableIdMap[key]) return { notFound: true, props: {} };

    const [people, organizations, agenda, prizes, templates, projects] =
      await Promise.all([
        new PersonModel(schema.appId, tableIdMap.Person).getAll(),
        new OrganizationModel(schema.appId, tableIdMap.Organization).getAll(),
        new AgendaModel(schema.appId, tableIdMap.Agenda).getAll(),
        new PrizeModel(schema.appId, tableIdMap.Prize).getAll(),
        new TemplateModel(schema.appId, tableIdMap.Template).getAll(),
        new ProjectModel(schema.appId, tableIdMap.Project).getAll(),
      ]);

    return {
      props: {
        activity,
        hackathon: {
          people,
          organizations,
          agenda,
          prizes,
          templates,
          projects,
        },
      },
    };
  },
);

interface HackathonDetailProps {
  activity: Activity;
  hackathon: {
    people: Person[];
    organizations: Organization[];
    agenda: Agenda[];
    prizes: Prize[];
    templates: Template[];
    projects: Project[];
  };
}

const FormButtonBar = ["Person", "Project", "Product", "Evaluation"] as const;
const HeroBadgeTone = [
  "heroBadgeCyan",
  "heroBadgeGold",
  "heroBadgeGreen",
  "heroBadgeRose",
] as const;
const HighlightIcons = ["👥", "🚀", "🛠", "🏆", "🤝", "📅"] as const;

type FormGroupKey = (typeof FormButtonBar)[number];
type FormGroupMeta = Record<"title" | "description" | "eyebrow", I18nKey>;
type AgendaToneClass =
  | "formation"
  | "enrollment"
  | "competition"
  | "break"
  | "evaluation";

interface FormGroup {
  key: FormGroupKey;
  list: TableFormView[];
  meta: FormGroupMeta;
}

const FormSectionMeta: Record<FormGroupKey, FormGroupMeta> = {
  Person: {
    eyebrow: "participants",
    title: "hackathon_participant_registration",
    description: "hackathon_participant_registration_description",
  },
  Project: {
    eyebrow: "hackathon_team_lead",
    title: "hackathon_project_registration",
    description: "hackathon_project_registration_description",
  },
  Product: {
    eyebrow: "hackathon_submission",
    title: "product_submission",
    description: "hackathon_product_submission_description",
  },
  Evaluation: {
    eyebrow: "hackathon_review",
    title: "hackathon_evaluation_entry",
    description: "hackathon_evaluation_entry_description",
  },
};

const AgendaTypeClassMap: Partial<Record<string, AgendaToneClass>> = {
  workshop: "formation",
  formation: "formation",
  presentation: "enrollment",
  enrollment: "enrollment",
  coding: "competition",
  competition: "competition",
  break: "break",
  ceremony: "evaluation",
  evaluation: "evaluation",
};

const AgendaTypeLabelMap: Partial<Record<string, I18nKey>> = {
  workshop: "workshop",
  presentation: "presentation",
  coding: "coding",
  break: "break",
  ceremony: "ceremony",
};

const isPublicForm = ({ shared_limit }: TableFormView) =>
  ["anyone_editable"].includes(shared_limit as string);

const formatMoment = (value?: TableCellValue) =>
  value ? formatDate(value as string) : "";

const formatPeriod = (startedAt?: TableCellValue, endedAt?: TableCellValue) =>
  [formatMoment(startedAt), formatMoment(endedAt)].filter(Boolean).join(" - ");

const previewText = (items: TableCellValue[], fallback: string) =>
  items
    .map((item) => item?.toString())
    .filter(Boolean)
    .slice(0, 2)
    .join(" · ") || fallback;

const agendaToneClassOf = (type: TableCellValue, index: number) => {
  const normalized = type?.toString().toLowerCase() || "";
  const fallbackOrder: AgendaToneClass[] = [
    "formation",
    "enrollment",
    "competition",
    "break",
    "evaluation",
  ];

  return (
    AgendaTypeClassMap[normalized] ||
    fallbackOrder[index % fallbackOrder.length]
  );
};

const agendaTypeLabelOf = (
  type: TableCellValue,
  t: (key: I18nKey) => string,
  fallback = "-",
) => {
  const normalized = type?.toString().toLowerCase() || "";
  const i18nKey = AgendaTypeLabelMap[normalized];

  return i18nKey ? t(i18nKey) : type?.toString() || fallback;
};

const HackathonDetail: FC<HackathonDetailProps> = observer(
  ({ activity, hackathon }) => {
    const { t } = useContext(I18nContext);

    const {
        name,
        summary,
        location,
        startTime,
        endTime,
        databaseSchema,
        host,
        image,
        type: activityType,
      } = activity,
      { people, organizations, agenda, prizes, templates, projects } =
        hackathon;
    const forms = ((databaseSchema as Partial<BiTableSchema> | undefined)
      ?.forms || {}) as Partial<Record<FormGroupKey, TableFormView[]>>;
    const agendaItems = [...agenda].sort(
      ({ startedAt: left }, { startedAt: right }) =>
        new Date((left as string) || 0).getTime() -
        new Date((right as string) || 0).getTime(),
    );
    const hostTags = (host as string[] | undefined)?.slice(0, 2) || [];
    const eventRange = formatPeriod(startTime, endTime);
    const locationText =
      (location as TableCellLocation | undefined)?.full_address || "-";
    const heroBadges = [
      (activityType as string) || t("hackathon"),
      ...hostTags,
      formatMoment(startTime),
      formatMoment(endTime),
    ].filter(Boolean);
    const heroStats = [
      { label: t("participants"), value: people.length },
      { label: t("projects"), value: projects.length },
      { label: t("templates"), value: templates.length },
      { label: t("prizes"), value: prizes.length },
    ];
    const agendaPreview = agendaItems.slice(0, 3);
    const overviewPills = agendaItems.slice(0, 6);

    const formGroups = FormButtonBar.flatMap<FormGroup>((key) => {
      const list = (forms[key] || []).filter(isPublicForm);

      return list[0] ? [{ key, list, meta: FormSectionMeta[key] }] : [];
    });
    const primaryForm =
      formGroups.find(({ key }) => key === "Person") ||
      formGroups.find(({ key }) => key === "Project") ||
      formGroups[0];
    const secondaryForm =
      formGroups.find(
        ({ key }) => key === "Project" && key !== primaryForm?.key,
      ) || formGroups.find(({ key }) => key !== primaryForm?.key);
    const formPreview =
      formGroups
        .map(({ meta }) => t(meta.eyebrow))
        .filter(Boolean)
        .slice(0, 2)
        .join(" · ") || t("hackathon_action_hub");

    const highlightCards = [
      {
        icon: HighlightIcons[0],
        title: t("participants"),
        value: people.length,
        description: t(FormSectionMeta.Person.description),
      },
      {
        icon: HighlightIcons[1],
        title: t("projects"),
        value: projects.length,
        description: t(FormSectionMeta.Project.description),
      },
      {
        icon: HighlightIcons[2],
        title: t("templates"),
        value: templates.length,
        description: previewText(
          templates.map(({ name }) => name),
          t("templates"),
        ),
      },
      {
        icon: HighlightIcons[3],
        title: t("prizes"),
        value: prizes.length,
        description: previewText(
          prizes.map(({ name }) => name),
          t("hackathon_prizes"),
        ),
      },
      {
        icon: HighlightIcons[4],
        title: t("organizations"),
        value: organizations.length,
        description: previewText(
          organizations.map(({ name }) => name),
          t("organizations"),
        ),
      },
      {
        icon: HighlightIcons[5],
        title: t("agenda"),
        value: agendaItems.length,
        description: previewText(
          agendaItems.map(({ name }) => name),
          eventRange || t("agenda"),
        ),
      },
    ];

    return (
      <>
        <PageHead title={name as string} />

        <section className={styles.hero}>
          <Container>
            <div className={styles.heroInner}>
              <div className={styles.heroContent}>
                <ul className={`list-unstyled ${styles.heroEyebrow}`}>
                  {heroBadges.map((badge, index) => (
                    <li
                      key={`${badge}-${index}`}
                      className={`${styles.heroBadge} ${styles[HeroBadgeTone[index % HeroBadgeTone.length]]}`}
                    >
                      {badge}
                    </li>
                  ))}
                </ul>

                <h1 className={styles.title}>
                  <span className={styles.heroTitlePrimary}>
                    {name as string}
                  </span>
                  <span className={styles.heroTitleSecondary}>
                    {(activityType as string) || t("hackathon_detail")}
                  </span>
                </h1>

                <p className={styles.description}>{summary as string}</p>

                <nav
                  className={styles.heroActions}
                  aria-label={t("hackathon_action_hub")}
                >
                  {primaryForm ? (
                    <a
                      className={styles.actionButton}
                      href={primaryForm.list[0].shared_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t(primaryForm.meta.title)}
                    </a>
                  ) : (
                    <a className={styles.actionButton} href="#entry-hub">
                      {t("hackathon_entry_flow")}
                    </a>
                  )}

                  <a className={styles.actionButtonGhost} href="#schedule">
                    {t("agenda")}
                  </a>
                </nav>

                <ul className={`list-unstyled ${styles.heroStats}`}>
                  {heroStats.map(({ label, value }) => (
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
                    <span className={styles.visualKicker}>
                      {t("event_info")}
                    </span>
                    <span className={styles.visualChip}>
                      {t("hackathon_detail")}
                    </span>
                  </div>

                  <figure className={styles.heroImageFrame}>
                    <div className={styles.mascotGlow} />

                    {image ? (
                      <LarkImage
                        src={image}
                        alt={name as string}
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <div className={styles.heroImageFallback}>
                        {(activityType as string) || t("hackathon")}
                      </div>
                    )}
                  </figure>

                  <div className={styles.heroVisualFoot}>
                    <p className={styles.heroVisualTitle}>{locationText}</p>
                    <p className={styles.heroVisualCopy}>
                      {eventRange || (summary as string)}
                    </p>
                  </div>
                </div>

                {primaryForm && (
                  <div
                    className={`${styles.heroFloatingCard} ${styles.heroFloatingCardTop}`}
                  >
                    <span className={styles.floatingLabel}>
                      {t(primaryForm.meta.eyebrow)}
                    </span>
                    <strong>{t(primaryForm.meta.title)}</strong>
                    <p>{t(primaryForm.meta.description)}</p>
                  </div>
                )}

                {agendaPreview[0] && (
                  <div
                    className={`${styles.heroFloatingCard} ${styles.heroFloatingCardBottom}`}
                  >
                    <span className={styles.floatingLabel}>
                      {t("hackathon_agenda_preview")}
                    </span>
                    <strong>{agendaPreview[0].name as string}</strong>
                    <p>
                      {formatPeriod(
                        agendaPreview[0].startedAt,
                        agendaPreview[0].endedAt,
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>

        <section className={styles.section}>
          <Container>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t("event_info")}</h2>
              <p className={styles.sectionSubtitle}>{t("event_description")}</p>
              <div className={styles.accentLine} />
            </header>

            <div className={styles.themePanel}>
              <div className={styles.themeText}>
                {(activityType as string) || t("hackathon")}
              </div>
              <p className={styles.themeSub}>{summary as string}</p>
            </div>

            <Row className="g-3 mt-1">
              {highlightCards.map(({ icon, title, value, description }) => (
                <Col key={title} md={6} xl={4}>
                  <article className={styles.trackCard}>
                    <span className={styles.trackIcon}>{icon}</span>
                    <div className={styles.trackName}>{title}</div>
                    <p className={styles.trackDesc}>{description}</p>
                    <span className={styles.trackMetric}>
                      {value} {title}
                    </span>
                  </article>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {formGroups[0] && (
          <section
            id="entry-hub"
            className={`${styles.section} ${styles.registerSection}`}
          >
            <Container>
              <div className={styles.registerWrap}>
                <article className={styles.registerCard}>
                  <div className={styles.registerCardInner}>
                    <p className={styles.regEyebrow}>
                      {t("hackathon_action_hub")}
                    </p>
                    <h2 className={styles.regTitle}>
                      {primaryForm
                        ? t(primaryForm.meta.title)
                        : t("hackathon_entry_flow")}
                    </h2>
                    <p className={styles.regDesc}>
                      {primaryForm
                        ? t(primaryForm.meta.description)
                        : t("hackathon_entry_flow_description")}
                    </p>

                    <nav
                      className={styles.regActions}
                      aria-label={t("hackathon_entry_flow")}
                    >
                      {primaryForm && (
                        <a
                          className={styles.actionButton}
                          href={primaryForm.list[0].shared_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t(primaryForm.meta.title)}
                        </a>
                      )}

                      {secondaryForm ? (
                        <a
                          className={styles.actionButtonGhost}
                          href={secondaryForm.list[0].shared_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t(secondaryForm.meta.title)}
                        </a>
                      ) : (
                        <a
                          className={styles.actionButtonGhost}
                          href="#schedule"
                        >
                          {t("agenda")}
                        </a>
                      )}
                    </nav>

                    <ul className={`list-unstyled ${styles.regFacts}`}>
                      <li>{eventRange || t("event_duration")}</li>
                      <li>{locationText}</li>
                      <li>{formPreview}</li>
                    </ul>
                  </div>
                </article>

                <div className={styles.entryHub}>
                  <header className={styles.entryHubHead}>
                    <p className={styles.entryEyebrow}>
                      {t("hackathon_entry_flow")}
                    </p>
                    <h3 className={styles.entryTitle}>
                      {t("hackathon_action_hub")}
                    </h3>
                    <p className={styles.entryCopy}>
                      {t("hackathon_entry_flow_description")}
                    </p>
                  </header>

                  <Row as="ol" className="list-unstyled g-3 mb-0">
                    {formGroups.map(({ key, list, meta }, index) => (
                      <Col as="li" key={key} md={6}>
                        <article className={styles.entryCard}>
                          <span className={styles.entryStep}>
                            {t("hackathon_step")}{" "}
                            {String(index + 1).padStart(2, "0")} ·{" "}
                            {t(meta.eyebrow)}
                          </span>
                          <h4>{t(meta.title)}</h4>
                          <p>{t(meta.description)}</p>

                          <div className={styles.entryMetaRow}>
                            <span className={styles.entryMeta}>
                              {list.length}
                            </span>
                            <span className={styles.entryMeta}>
                              {t(meta.eyebrow)}
                            </span>
                          </div>

                          <nav
                            className={styles.entryLinks}
                            aria-label={t(meta.title)}
                          >
                            {list.map(({ name, shared_url }) => (
                              <a
                                key={`${name}-${shared_url}`}
                                className={styles.entryLink}
                                href={shared_url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {name}
                              </a>
                            ))}
                          </nav>
                        </article>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Container>
          </section>
        )}

        {agendaItems[0] && (
          <section id="schedule" className={styles.section}>
            <Container>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t("agenda")}</h2>
                <p className={styles.sectionSubtitle}>{t("event_duration")}</p>
                <div className={styles.accentLine} />
              </header>

              <div className={styles.scheduleIntro}>
                <p className={styles.scheduleKicker}>{eventRange}</p>
                <h3 className={styles.scheduleLead}>{name as string}</h3>
                <p className={styles.scheduleCopy}>{summary as string}</p>
              </div>

              <div className={styles.scheduleOverview}>
                {overviewPills.map(({ id, name }) => (
                  <div key={id} className={styles.schedulePill}>
                    {name as string}
                  </div>
                ))}
              </div>

              <div className={styles.scheduleDays}>
                {agendaItems.map(
                  ({ id, name, type, summary, startedAt, endedAt }, index) => {
                    const toneClass = agendaToneClassOf(type, index);

                    return (
                      <article
                        key={id}
                        className={`${styles.dayCard} ${styles[toneClass]}`}
                      >
                        <div className={styles.dayCardHead}>
                          <span className={styles.dayNo}>
                            PHASE {String(index + 1).padStart(2, "0")}
                          </span>
                          <time
                            className={styles.dayDate}
                            dateTime={startedAt as string}
                          >
                            {formatPeriod(startedAt, endedAt)}
                          </time>
                        </div>

                        <h3 className={styles.dayTitle}>{name as string}</h3>
                        <p className={styles.daySub}>
                          {(summary as string) || agendaTypeLabelOf(type, t)}
                        </p>

                        <dl className={styles.dayAgenda}>
                          <div>
                            <dt className={styles.timePill}>{t("type")}</dt>
                            <dd className={styles.agendaCopy}>
                              <strong>{agendaTypeLabelOf(type, t)}</strong>
                              <span>
                                {(summary as string) ||
                                  eventRange ||
                                  locationText}
                              </span>
                            </dd>
                          </div>

                          <div>
                            <dt className={styles.timePill}>
                              {t("start_time")}
                            </dt>
                            <dd className={styles.agendaCopy}>
                              <strong>{formatMoment(startedAt)}</strong>
                              <span>{t("event_duration")}</span>
                            </dd>
                          </div>

                          <div>
                            <dt className={styles.timePill}>{t("end_time")}</dt>
                            <dd className={styles.agendaCopy}>
                              <strong>{formatMoment(endedAt)}</strong>
                              <span>
                                {t("event_location")}: {locationText}
                              </span>
                            </dd>
                          </div>
                        </dl>
                      </article>
                    );
                  },
                )}
              </div>
            </Container>
          </section>
        )}

        {(prizes[0] || organizations[0]) && (
          <section className={styles.section}>
            <Container>
              {prizes[0] && (
                <>
                  <header className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{t("prizes")}</h2>
                    <p className={styles.sectionSubtitle}>
                      {t("hackathon_prizes")}
                    </p>
                    <div className={styles.accentLine} />
                  </header>

                  <div className={styles.awardsGrid}>
                    {prizes.map(
                      (
                        {
                          id,
                          name,
                          image,
                          summary,
                          level,
                          sponsor,
                          price,
                          amount,
                        },
                        index,
                      ) => (
                        <article key={id} className={styles.badgeTile}>
                          {image && (
                            <div className={styles.badgeArtWrap}>
                              <LarkImage
                                src={image}
                                alt={name as string}
                                className={styles.badgeArt}
                              />
                            </div>
                          )}

                          <div className={styles.badgeTileBody}>
                            <span className={styles.badgeTierLabel}>
                              {(level as string) || `#${index + 1}`}
                            </span>
                            <h3 className={styles.badgeTileTitle}>
                              {name as string}
                            </h3>
                            <p className={styles.badgeTileCopy}>
                              {(summary as string) ||
                                previewText(
                                  [sponsor, price, amount],
                                  t("prizes"),
                                )}
                            </p>

                            <dl className={styles.prizeMeta}>
                              {sponsor && (
                                <div>
                                  <dt>{t("sponsor")}</dt>
                                  <dd>{sponsor as string}</dd>
                                </div>
                              )}
                              {price && (
                                <div>
                                  <dt>{t("price")}</dt>
                                  <dd>{price as string}</dd>
                                </div>
                              )}
                              {amount && (
                                <div>
                                  <dt>{t("amount")}</dt>
                                  <dd>{amount as string}</dd>
                                </div>
                              )}
                            </dl>
                          </div>
                        </article>
                      ),
                    )}
                  </div>
                </>
              )}

              {organizations[0] && (
                <div className={styles.supportCard}>
                  <div className={styles.supportCopy}>
                    <p className={styles.supportEyebrow}>
                      {t("organizations")}
                    </p>
                    <h3 className={styles.supportTitle}>
                      {previewText(
                        organizations.map(({ name }) => name),
                        t("organizations"),
                      )}
                    </h3>
                    <p className={styles.supportDescription}>
                      {summary as string}
                    </p>
                  </div>

                  <nav
                    className={styles.partnerGrid}
                    aria-label={t("organizations")}
                  >
                    {organizations.map(({ id, name, link, logo }) => {
                      const imageNode = (
                        <LarkImage
                          src={logo}
                          alt={name as string}
                          className={styles.partnerLogo}
                        />
                      );

                      return link ? (
                        <a
                          key={id}
                          href={link as string}
                          target="_blank"
                          rel="noreferrer"
                          title={name as string}
                          className={styles.partnerLink}
                        >
                          {imageNode}
                        </a>
                      ) : (
                        <div
                          key={id}
                          className={styles.partnerLink}
                          title={name as string}
                        >
                          {imageNode}
                        </div>
                      );
                    })}
                  </nav>
                </div>
              )}
            </Container>
          </section>
        )}

        {(templates[0] || projects[0]) && (
          <section className={styles.section}>
            <Container>
              {templates[0] && (
                <>
                  <header className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{t("templates")}</h2>
                    <p className={styles.sectionSubtitle}>{t("source_code")}</p>
                    <div className={styles.accentLine} />
                  </header>

                  <Row className="g-3">
                    {templates.map(
                      ({
                        id,
                        name,
                        languages,
                        tags,
                        sourceLink,
                        summary,
                        previewLink,
                      }) => (
                        <Col key={id} md={6} xl={4}>
                          <article className={styles.resourceCard}>
                            <div className={styles.resourceHead}>
                              <h3 className={styles.resourceTitle}>
                                {name as string}
                              </h3>
                            </div>
                            <p className={styles.resourceDescription}>
                              {summary as string}
                            </p>

                            <ul className={`list-unstyled ${styles.topicList}`}>
                              {(languages as string[]).map((language) => (
                                <li key={language} className={styles.topicChip}>
                                  {language}
                                </li>
                              ))}
                              {(tags as string[]).map((tag) => (
                                <li key={tag} className={styles.topicChipMuted}>
                                  {tag}
                                </li>
                              ))}
                            </ul>

                            <nav
                              className={styles.resourceLinks}
                              aria-label={name as string}
                            >
                              {sourceLink && (
                                <a
                                  className={styles.entryLink}
                                  href={sourceLink as string}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {t("source_code")}
                                </a>
                              )}
                              {previewLink && (
                                <a
                                  className={styles.entryLink}
                                  href={previewLink as string}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {t("preview")}
                                </a>
                              )}
                            </nav>
                          </article>
                        </Col>
                      ),
                    )}
                  </Row>
                </>
              )}

              {projects[0] && (
                <>
                  <header
                    className={`${styles.sectionHeader} ${styles.projectHeader}`}
                  >
                    <h2 className={styles.sectionTitle}>{t("projects")}</h2>
                    <p className={styles.sectionSubtitle}>{t("products")}</p>
                    <div className={styles.accentLine} />
                  </header>

                  <Row className="g-3">
                    {projects.map(
                      ({ id, name, score, summary, createdBy, members }) => {
                        const creator = createdBy as TableCellUser | undefined;
                        const scoreText =
                          score === null || score === undefined || score === ""
                            ? "—"
                            : `${score}`;
                        const memberNames =
                          (members as string[] | undefined)?.join(", ") || "—";

                        return (
                          <Col key={id} md={6} xl={4}>
                            <article className={styles.projectCard}>
                              <div className={styles.projectHead}>
                                <h3 className={styles.projectTitle}>
                                  <Link
                                    href={`${ActivityModel.getLink(activity)}/team/${id}`}
                                  >
                                    {name as string}
                                  </Link>
                                </h3>
                                <div className={styles.scoreCircle}>
                                  {scoreText}
                                </div>
                              </div>

                              <p className={styles.projectSummary}>
                                {summary as string}
                              </p>

                              <dl className={styles.projectMeta}>
                                <div>
                                  <dt>{t("created_by")}</dt>
                                  <dd>
                                    {creator?.email ? (
                                      <a href={`mailto:${creator.email}`}>
                                        {creator.name}
                                      </a>
                                    ) : (
                                      creator?.name || "—"
                                    )}
                                  </dd>
                                </div>
                                <div>
                                  <dt>{t("members")}</dt>
                                  <dd>{memberNames}</dd>
                                </div>
                              </dl>
                            </article>
                          </Col>
                        );
                      },
                    )}
                  </Row>
                </>
              )}
            </Container>
          </section>
        )}

        {people[0] && (
          <section className={styles.section}>
            <Container>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t("participants")}</h2>
                <p className={styles.sectionSubtitle}>{t("github_account")}</p>
                <div className={styles.accentLine} />
              </header>

              <div className={styles.participantCloud}>
                {people.map(({ id, name, avatar, githubLink }) => {
                  const content = (
                    <>
                      <LarkImage
                        className={styles.avatar}
                        src={avatar}
                        alt={name as string}
                        title={name as string}
                      />
                      <span className={styles.participantName}>
                        {name as string}
                      </span>
                    </>
                  );

                  return githubLink ? (
                    <a
                      key={id}
                      className={styles.participantCard}
                      target="_blank"
                      rel="noreferrer"
                      href={githubLink as string}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={id} className={styles.participantCard}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </Container>
          </section>
        )}
      </>
    );
  },
);

export default HackathonDetail;
