import { BarSeries, PieSeries, SVGCharts, Title, Tooltip, XAxis, YAxis } from 'echarts-jsx';
import { observer } from 'mobx-react';
import { FC, useContext } from 'react';

import { I18nContext } from '../../models/Translation';
import { OrganizationStatistic, sortStatistic } from '../../models/Organization';

const OrganizationCharts: FC<OrganizationStatistic> = observer(
  ({ entityType, serviceCategory, coverageArea }) => {
    const { t } = useContext(I18nContext);

    const typeList = sortStatistic(entityType),
      categoryList = sortStatistic(serviceCategory),
      areaList = sortStatistic(coverageArea);

    return (
      <div style={{ minHeight: '70vh' }}>
        <SVGCharts>
          <Title>NGO 地区分布</Title>
          <XAxis type="category" data={areaList.map(([key]) => key)} />
          <YAxis type="value" />
          <BarSeries data={areaList.map(([{}, value]) => value)} />
          <Tooltip />
        </SVGCharts>

        <SVGCharts>
          <Title>NGO 服务分布</Title>
          <XAxis type="category" data={categoryList.map(([key]) => key)} />
          <YAxis type="value" />
          <BarSeries data={categoryList.map(([{}, value]) => value)} />
          <Tooltip />
        </SVGCharts>

        <SVGCharts className="col-auto">
          <Title>NGO 类型分布</Title>
          <PieSeries data={typeList.map(([name, value]) => ({ name, value }))} />
          <Tooltip trigger="item" />
        </SVGCharts>
      </div>
    );
  },
);
export default OrganizationCharts;
