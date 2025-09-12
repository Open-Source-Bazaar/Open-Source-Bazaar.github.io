import { Dialog } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { splitArray } from 'web-utility';

import { Organization, OrganizationModel } from '../../models/Organization';
import { LarkImage } from '../LarkImage';
import { OrganizationCard } from './Card';

export type ChinaPublicInterestLandscapeProps = Pick<OrganizationModel, 'categoryMap'>;

@observer
export class ChinaPublicInterestLandscape extends Component<ChinaPublicInterestLandscapeProps> {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...data } = organization;

    return <OrganizationCard {...data} />;
  }

  renderLogo = ({ name, logo }: Organization) => (
    <li
      key={name as string}
      className="border list-item"
      style={{ cursor: 'pointer' }}
      onClick={() => this.modal.open({ name: name as string })}
    >
      <LarkImage
        className="object-fit-contain"
        style={{ width: this.itemSize + 'rem', height: this.itemSize + 'rem' }}
        src={logo?.data?.attributes?.url}
      />
    </li>
  );

  render() {
    const rows = splitArray(Object.entries(this.props.categoryMap), 2);

    return (
      <>
        {rows.map((row, index) => (
          <ul
            key={index}
            className="list-unstyled d-flex flex-row gap-2"
          >
            {row.map(([name, list]) => (
              <li key={name} className="flex-fill">
                <h2 className="h5 p-2 text-white bg-primary">
                  {name}
                </h2>

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