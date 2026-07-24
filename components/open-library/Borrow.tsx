import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Badge, Table } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { type BorrowHistory } from '../../models/Book';
import { I18nContext } from '../../models/Translation';

export const BorrowHistoryRow: FC<BorrowHistory> = observer(
  ({ borrower, borrowDate, returnDate }) => {
    const { t } = useContext(I18nContext);

    return (
      <tr>
        <td>{borrower}</td>
        <td>{formatDate(borrowDate, 'YYYY-MM-DD')}</td>
        <td>{returnDate ? formatDate(returnDate, 'YYYY-MM-DD') : '-'}</td>
        <td>
          {returnDate ? (
            <Badge bg="success">{t('returned')}</Badge>
          ) : (
            <Badge bg="warning" text="dark">
              {t('active')}
            </Badge>
          )}
        </td>
      </tr>
    );
  },
);

export const BorrowHistoryTabContent: FC<{ history?: BorrowHistory[] }> = observer(
  ({ history }) => {
    const { t } = useContext(I18nContext);

    return history?.[0] ? (
      <Table hover responsive>
        <thead>
          <tr>
            <th>{t('borrower')}</th>
            <th>{t('borrow_date')}</th>
            <th>{t('return_date')}</th>
            <th>{t('status')}</th>
          </tr>
        </thead>
        <tbody>
          {history.map(({ borrower, borrowDate, returnDate }) => (
            <BorrowHistoryRow
              key={`${borrower}-${borrowDate}`}
              {...{ borrower, borrowDate, returnDate }}
            />
          ))}
        </tbody>
      </Table>
    ) : (
      <div className="text-center py-5">
        <p>{t('not_borrowed_yet')}</p>
      </div>
    );
  },
);
