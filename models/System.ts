import { observable } from 'mobx';
import { BiSearchModelClass } from 'mobx-lark';
import { BaseModel, DataObject, Filter, ListModel, toggle } from 'mobx-restful';
import { Constructor } from 'web-utility';

import { SearchActivityModel } from './Activity';
import { ownClient } from './Base';
import { OrganizationModel } from './Organization';

export type SearchableFilter<D extends DataObject> = Filter<D> & {
  keywords?: string;
};
export type SearchModel<T extends DataObject = any> = ListModel<T, SearchableFilter<T>>;

export type SearchPageMeta = Pick<
  InstanceType<BiSearchModelClass>,
  'pageIndex' | 'currentPage' | 'pageCount'
>;

export type CityCoordinateMap = Record<string, [number, number]>;

export class SystemModel extends BaseModel {
  searchMap = {
    activity: SearchActivityModel,
    NGO: OrganizationModel,
  } as Record<string, Constructor<SearchModel<DataObject>>>;

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
      globalThis.innerWidth < globalThis.innerHeight || globalThis.innerWidth < 992);

  @toggle('downloading')
  async getCityCoordinate() {
    const { body } = await ownClient.get<CityCoordinateMap>(
      'https://idea2app.github.io/public-meta-data/china-city-coordinate.json',
    );
    return (this.cityCoordinate = body!);
  }
}

export default new SystemModel();
