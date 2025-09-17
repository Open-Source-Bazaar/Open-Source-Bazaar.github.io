import { BarSeries, PieSeries, SVGCharts, Title, Tooltip, XAxis, YAxis } from 'echarts-jsx';
import { observer } from 'mobx-react';
import { FC, useContext } from 'react';

import { OrganizationStatistic, sortStatistic } from '../../models/Organization';
import { I18nContext } from '../../models/Translation';

const OrganizationCharts: FC<OrganizationStatistic> = observer(
  ({ entityType, serviceCategory, coverageArea }) => {
    const { t } = useContext(I18nContext);

    const typeList = sortStatistic(entityType),
      categoryList = sortStatistic(serviceCategory),
      areaList = sortStatistic(coverageArea);

    return (
      <div style={{ minHeight: '70vh' }}>
        <SVGCharts>
          <Title>{t('NGO_area_distribution')}</Title>
          <XAxis type="category" data={areaList.map(([key]) => key)} />
          <YAxis type="value" />
          <BarSeries data={areaList.map(([{}, value]) => value)} />
          <Tooltip />
        </SVGCharts>

        <SVGCharts>
          <Title>{t('NGO_service_distribution')}</Title>
          <XAxis type="category" data={categoryList.map(([key]) => key)} />
          <YAxis type="value" />
          <BarSeries data={categoryList.map(([{}, value]) => value)} />
          <Tooltip />
        </SVGCharts>

        <SVGCharts className="col-auto">
          <Title>{t('NGO_type_distribution')}</Title>
          <PieSeries data={typeList.map(([name, value]) => ({ name, value }))} />
          <Tooltip trigger="item" />
        </SVGCharts>
      </div>
    );
  },
);
export default OrganizationCharts;
