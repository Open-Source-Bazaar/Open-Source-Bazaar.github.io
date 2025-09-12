import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import dynamic from 'next/dynamic';

import { OrganizationStatistic } from '../../models/Organization';

const ChinaMap = dynamic(() => import('./ChinaMap'), { ssr: false });

export interface CityStatisticMapProps {
  data: OrganizationStatistic['city'];
  onChange?: (city: string) => any;
}

@observer
export class CityStatisticMap extends ObservedComponent<CityStatisticMapProps> {
  @computed
  get markers() {
    const { data } = this.observedProps;

    return data.map(({ label: city, count }) => ({
      tooltip: `${city} ${count}`,
      position: [34.32, 108.55] as [number, number], // Default center for now
    }));
  }

  handleChange = ({ latlng: { lat, lng } }: any) => {
    const { markers } = this;
    const { tooltip } = markers.find(({ position: p }) => 
      p instanceof Array && lat === p[0] && lng === p[1]
    ) || {};
    const [city] = tooltip?.split(/\s+/) || [];

    this.props.onChange?.(city);
  };

  render() {
    const { markers } = this;

    return (
      <ChinaMap
        style={{ height: '70vh' }}
        center={[34.32, 108.55]}
        zoom={4}
        markers={markers}
        onMarkerClick={this.handleChange}
      />
    );
  }
}