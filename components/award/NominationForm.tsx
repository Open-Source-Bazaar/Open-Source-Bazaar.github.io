import { FC, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { I18nContext } from '../../models/Translation';
import styles from './Award.module.less';

export const AWARD_NOMINATION_FORM_URL =
  'https://open-source-bazaar.feishu.cn/share/base/form/shrcniqv1nEnCrygFy0qX4fPcSg';

export interface NominationFormProps {
  show: boolean;
  onHide: () => void;
}

export const NominationForm: FC<NominationFormProps> = ({ show, onHide }) => {
  const { t } = useContext(I18nContext);

  return (
    <Modal show={show} size="lg" centered scrollable onHide={onHide}>
      <Modal.Header closeButton closeLabel={t('award_close')}>
        <Modal.Title>{t('award_submit_nomination')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <iframe
          className={styles.nominationForm}
          src={AWARD_NOMINATION_FORM_URL}
          title={t('award_nomination_form_title')}
          loading="lazy"
        />
      </Modal.Body>
      <Modal.Footer>
        <small className="me-auto text-muted">{t('award_form_refresh_hint')}</small>
        <Button variant="secondary" onClick={onHide}>
          {t('award_close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
