import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { FC, useContext, useState } from 'react';

import { Agenda } from '../../../models/Hackathon';
import { I18nContext } from '../../../models/Translation';
import { Countdown, TimeUnit } from '../../Base/Countdown';
import styles from './AgendaCountdown.module.less';
import { agendaTypeLabelOf, resolveCountdownState } from './utility';

export interface AgendaCountdownProps {
  agendaItems: Agenda[];
  endTime?: TableCellValue;
  startTime?: TableCellValue;
  units: TimeUnit[];
}

export const AgendaCountdown: FC<AgendaCountdownProps> = observer(
  ({ agendaItems, endTime, startTime, units }) => {
    const { t } = useContext(I18nContext);
    const [referenceTime, setReferenceTime] = useState(Date.now());
    const { nextItem: nextAgendaItem, countdownTo } = resolveCountdownState(
      agendaItems,
      referenceTime,
      startTime,
      endTime,
    );

    if (!countdownTo) return null;

    const countdownLabel = nextAgendaItem
      ? agendaTypeLabelOf(nextAgendaItem.type, t, t('agenda'))
      : t('event_duration');

    return (
      <div className={styles.wrap}>
        {countdownLabel && <p className={styles.label}>{countdownLabel}</p>}

        <Countdown
          className={styles.grid}
          endTime={countdownTo}
          onEnd={() => setReferenceTime(Date.now())}
          units={units}
        />
      </div>
    );
  },
);
