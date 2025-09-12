import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { ScrollList } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { Accordion, Button, Nav } from 'react-bootstrap';
import { sum } from 'web-utility';

import { OrganizationModel, OrganizationStatistic } from '../../models/Organization';
import { i18n,I18nContext } from '../../models/Translation';
import { TagNav } from '../Base/TagNav';
import { CityStatisticMap } from '../Map/index';
import { OrganizationCardProps } from './Card';
import { OrganizationListLayout } from './List';

const OrganizationCharts = dynamic(() => import('./Charts'), { ssr: false });

export interface ChinaPublicInterestMapProps extends OrganizationStatistic {
  store: OrganizationModel;
}

@observer
export class ChinaPublicInterestMap extends ObservedComponent<
  ChinaPublicInterestMapProps,
  typeof i18n
> {
  static contextType = I18nContext;

  @observable
  accessor tabKey: 'map' | 'chart' = 'map';

  switchFilter: Required<OrganizationCardProps>['onSwitch'] = ({ type, tags, city }) => {
    const { filter } = this.props.store;

    this.props.store.clear();

    return this.props.store.getList(
      type ? { ...filter, type } : tags ? { ...filter, tags } : city ? { city } : {},
    );
  };

  renderFilter() {
    const { type, tag } = this.props,
      { filter, totalCount } = this.props.store;
    const count =
      totalCount != null && totalCount !== Infinity
        ? totalCount
        : sum(...type.map(t => t.count)) || 0;

    return (
      <Accordion as="header" className="sticky-top bg-white" style={{ top: '5rem' }}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="w-100 d-flex justify-content-between align-items-center">
              Filter

              <TagNav list={Object.values(filter) as string[]} />

              Total Organizations: {count}
            </div>
          </Accordion.Header>
          <Accordion.Body as="form" onReset={() => this.switchFilter({})}>
            <fieldset className="mb-3">
              <legend>Type</legend>

              <TagNav list={type.map(t => t.label)} onCheck={type => this.switchFilter({ type })} />
            </fieldset>
            <fieldset className="mb-3">
              <legend>Tag</legend>

              <TagNav list={tag.map(t => t.label)} onCheck={tags => this.switchFilter({ tags })} />
            </fieldset>
            <Button type="reset" variant="warning" size="sm">
              Reset
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }

  renderTab() {
    const { props, tabKey } = this;

    return (
      <div>
        <Nav
          variant="pills"
          className="justify-content-center mb-3"
          activeKey={tabKey}
          onSelect={key => key && (this.tabKey = key as ChinaPublicInterestMap['tabKey'])}
        >
          <Nav.Item>
            <Nav.Link eventKey="map">Map</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="chart">Chart</Nav.Link>
          </Nav.Item>
        </Nav>

        {tabKey !== 'map' ? (
          <OrganizationCharts {...props} />
        ) : (
          <CityStatisticMap data={props.city} onChange={city => this.switchFilter({ city })} />
        )}
      </div>
    );
  }

  render() {
    return (
      <>
        {this.renderTab()}

        {this.renderFilter()}

        <ScrollList
          translator={i18n}
          store={this.props.store}
          renderList={allItems => (
            <OrganizationListLayout defaultData={allItems} onSwitch={this.switchFilter} />
          )}
        />
      </>
    );
  }
}