import { computed, observable } from 'mobx';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { Container } from 'react-bootstrap';
import { buildURLData } from 'web-utility';

import { PageHead } from '../components/Layout/PageHead';
import { i18n, I18nContext } from '../models/Translation';
import { SignatureModel } from '../models/Signature';

export const getServerSideProps = compose(router);

@observer
export default class SignaturePage extends ObservedComponent<RouteProps, typeof i18n> {
  static contextType = I18nContext;

  @observable
  accessor signatureStore = new SignatureModel();

  @computed
  get linkData() {
    const { route } = this.observedProps;
    const { valueName, algorithmName, publicKeyName, signatureName, value } = route.query,
      { algorithm, publicKey } = this.signatureStore;
    const signature = this.signatureStore.signatureMap[value + ''] || {};

    return buildURLData({
      [valueName + '']: value,
      [algorithmName + '']: btoa(JSON.stringify(algorithm)),
      [publicKeyName + '']: publicKey,
      [signatureName + '']: signature,
    });
  }

  componentDidMount() {
    const { value = '' } = this.props.route.query;

    if (!value) this.signatureStore.makeKeyPair();
    else this.signatureStore.sign(value + '');
  }

  render() {
    const { t } = this.observedContext,
      { value, iframeLink } = this.props.route.query;

    const title = value ? textJoin(t('sign'), value + '') : t('generate_key_pair');

    return (
      <Container>
        <PageHead title={title} />

        <h1 className="my-5 text-truncate">{title}</h1>

        <iframe className="border-0 w-100 vh-100" src={`${iframeLink}?${this.linkData}`} />
      </Container>
    );
  }
}
