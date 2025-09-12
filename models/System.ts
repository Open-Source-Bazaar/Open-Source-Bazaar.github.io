import { observable } from 'mobx';
import { BiSearchModelClass } from 'mobx-lark';
import { BaseModel } from 'mobx-restful';

export type SearchPageMeta = Pick<
  InstanceType<BiSearchModelClass>,
  'pageIndex' | 'currentPage' | 'pageCount'
>;

export type CityCoordinateMap = Record<string, [number, number]>;

export class SystemModel extends BaseModel {
  searchMap: Record<string, BiSearchModelClass> = {};

  @observable
  accessor screenNarrow = false;

  @observable
  accessor cityCoordinate: CityCoordinateMap = {};

  constructor() {
    super();

    this.updateScreen();
    globalThis.addEventListener?.('resize', this.updateScreen);
  }

  updateScreen = () =>
    (this.screenNarrow =
      globalThis.innerWidth < globalThis.innerHeight ||
      globalThis.innerWidth < 992);

  async getCityCoordinate() {
    // Placeholder for city coordinate data
    // In production, this would load from an API or static data
    this.cityCoordinate = {
      '北京': [116.4074, 39.9042],
      '上海': [121.4737, 31.2304],
      '广州': [113.2644, 23.1291],
      '深圳': [114.0579, 22.5431],
      '杭州': [120.1551, 30.2741],
      '成都': [104.0668, 30.5728],
      '武汉': [114.3054, 30.5931],
      '西安': [108.9402, 34.3416],
    };
  }
}

export default new SystemModel();
