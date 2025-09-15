import { Dialog } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Image, Modal } from 'react-bootstrap';
import { splitArray } from 'web-utility';

import { Organization } from '@open-source-bazaar/china-ngo-database';
import systemStore from '../../models/System';
import { OrganizationModel } from '../../models/Organization';

import { OrganizationCard } from './Card';
import styles from './LandScape.module.less';

export type OpenCollaborationLandscapeProps = Pick<OrganizationModel, 'categoryMap'>;

@observer
export class OpenCollaborationLandscape extends Component<OpenCollaborationLandscapeProps> {
  @observable
  accessor itemSize = 5;

  modal = new Dialog<{ name?: string }>(({ defer, name }) => (
    <Modal show={!!defer} onHide={() => defer?.resolve()}>
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{this.renderCard(name!)}</Modal.Body>
    </Modal>
  ));

  renderCard(name: string) {
    const organization = Object.values(this.props.categoryMap)
      .flat()
      .find(({ name: n }) => n === name);

    if (!organization) return <></>;

    const { id, ...data } = organization;

    return <OrganizationCard {...data} />;
  }

  renderLogo = ({ name }: Organization) => (
    <li
      key={name as string}
      className={`border ${styles.listItem}`}
      onClick={() => this.modal.open({ name: name as string })}
    >
      <div style={{ fontSize: this.itemSize + 'rem' }}>
        {name.slice(0, 2)}
        <br />
        {name.slice(2, 4)}
      </div>
    </li>
  );

  render() {
    const { screenNarrow } = systemStore;
    const rows = splitArray(Object.entries(this.props.categoryMap), 2);

    return (
      <>
        {rows.map(row => (
          <ul className={`list-unstyled d-flex flex-${screenNarrow ? 'column' : 'row'} gap-2`}>
            {row.map(([name, list]) => (
              <li key={name} className="flex-fill">
                <h2 className={`h5 p-2 text-white ${styles.groupTitle}`}>{name}</h2>

                <ol className="list-unstyled d-flex flex-wrap gap-2">
                  {list.map(this.renderLogo)}
                </ol>
              </li>
            ))}
          </ul>
        ))}
        <this.modal.Component />
      </>
    );
  }
}
