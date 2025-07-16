import { FeatureAttitude, filterLicenses, InfectionRange, License } from 'license-filter';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { Accordion, Button, ButtonGroup, Container, ProgressBar } from 'react-bootstrap';

import { PageHead } from '../components/Layout/PageHead';
import { licenseTips, optionValue } from '../components/License/helper';
import { i18n, I18nContext } from '../models/Translation';

interface List {
  license: License;
  score: number;
}

const choiceSteps = [
  'popularity',
  'reuseCondition',
  'infectionIntensity',
  'infectionRange',
  'jurisdiction',
  'patentStatement',
  'patentRetaliation',
  'enhancedAttribution',
  'privacyLoophole',
  'marketingEndorsement',
] as const;

@observer
export default class LicenseTool extends ObservedComponent<{}, typeof i18n> {
  static contextType = I18nContext;

  @observable
  accessor stepIndex = 0;

  @observable
  accessor keyIndex = 0;

  @observable
  accessor filterOption = {};

  @observable
  accessor disableChoose = false;

  @observable
  accessor lists: List[] = [];

  componentDidMount() {
    if (this.stepIndex === choiceSteps.length) this.disableChoose = true;
  }

  handleChoose = (value: string | null) => {
    const { stepIndex, keyIndex, filterOption } = this;

    const choice = value ? +value : 0;
    const key = choiceSteps[keyIndex];

    const newObject = { ...filterOption, [key]: choice };
    const tempLists = filterLicenses(newObject);

    this.filterOption = newObject;

    this.lists = tempLists;

    this.stepIndex = stepIndex < choiceSteps.length ? stepIndex + 1 : stepIndex;

    this.keyIndex = keyIndex < choiceSteps.length - 1 ? keyIndex + 1 : keyIndex;
  };

  backToLast = () => {
    const { stepIndex, keyIndex, filterOption, disableChoose } = this;
    const choice = 0;
    const key = choiceSteps[keyIndex];

    const newObject = { ...filterOption, [key]: choice };
    const tempLists = filterLicenses(newObject);

    this.filterOption = newObject;

    this.stepIndex =
      stepIndex === choiceSteps.length ? stepIndex - 2 : stepIndex > 0 ? stepIndex - 1 : stepIndex;
    this.keyIndex = keyIndex > 0 ? keyIndex - 1 : keyIndex;

    if (disableChoose) this.disableChoose = false;
    this.lists = tempLists;
  };

  render() {
    const i18n = this.observedContext;
    const { t } = i18n,
      { keyIndex, disableChoose, lists } = this,
      now = Math.ceil(100 / choiceSteps.length);
    const percent = (keyIndex + 1) * now;

    return (
      <Container className="py-5">
        <PageHead title={t('license_tool_headline')} />
        <h1>{t('license_tool_headline')}</h1>

        <p>{t('license_tool_description')}</p>
        <p className="text-warning">{t('warn_info')}</p>

        <h2>
          {t('filter_option')}: {t(choiceSteps[keyIndex])}
        </h2>

        {licenseTips(i18n)[choiceSteps[keyIndex]].map(({ text }) => (
          <p key={text}>{text}</p>
        ))}
        <ProgressBar className="mb-3" variant="info" now={percent} label={`${percent}%`} />

        <Button className="mb-2" variant="warning" onClick={this.backToLast}>
          {t('last_step')}
        </Button>
        <ButtonGroup className="mb-2">
          {optionValue(i18n)[choiceSteps[keyIndex]].map(({ value, text }) => (
            <Button
              key={value}
              className="mx-1"
              value={value}
              id={`tb-${value}`}
              disabled={disableChoose}
              onClick={({ currentTarget: { value } }) => this.handleChoose(value)}
            >
              {text}
            </Button>
          ))}
        </ButtonGroup>

        <Accordion defaultActiveKey="0">
          {lists.map(({ license, score }, index) => (
            <Accordion.Item key={license.name} eventKey={index + 1 + ''}>
              <Accordion.Header>
                {license.name} {t('license_score')}: {score * 10}
              </Accordion.Header>
              <Accordion.Body>{this.renderInfo(license)}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    );
  }

  renderInfo({ link, feature }: License) {
    const { t } = this.observedContext;
    const judge = (attitude: FeatureAttitude) =>
      ({
        [FeatureAttitude.Positive]: t('attitude_positive'),
        [FeatureAttitude.Negative]: t('attitude_negative'),
        [FeatureAttitude.Undefined]: t('option_undefined'),
      })[attitude] || t('option_undefined');

    const judgeInfectionRange = (infectionRange: InfectionRange | undefined) =>
      infectionRange !== undefined
        ? {
            [InfectionRange.Library]: t('range_library'),
            [InfectionRange.File]: t('range_file'),
            [InfectionRange.Module]: t('range_module'),
          }[infectionRange]
        : t('option_undefined');

    return (
      <>
        <ul>
          <li>
            {t('popularity')}: {judge(feature.popularity)}
          </li>
          <li>
            {t('reuseCondition')}: {judge(feature.reuseCondition)}
          </li>
          <li>
            {t('infectionIntensity')}: {judge(feature.infectionIntensity)}
          </li>

          <li>
            {t('infectionRange')}: {judgeInfectionRange(feature.infectionRange)}
          </li>

          <li>
            {t('jurisdiction')}: {judge(feature.jurisdiction)}
          </li>
          <li>
            {t('patentStatement')}: {judge(feature.patentStatement)}
          </li>
          <li>
            {t('patentRetaliation')}: {judge(feature.patentRetaliation)}
          </li>
          <li>
            {t('enhancedAttribution')}: {judge(feature.enhancedAttribution)}
          </li>
          <li>
            {t('privacyLoophole')}: {judge(feature.privacyLoophole)}
          </li>
          <li>
            {t('marketingEndorsement')}: {judge(feature.marketingEndorsement)}
          </li>
        </ul>
        <Button size="sm" target="_blank" href={link}>
          {t('license_detail')}
        </Button>
      </>
    );
  }
}
