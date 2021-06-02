import { ID, PropertyID, PropertyType } from './core';
import { FileterOperatorType } from './filter';

/** Types of collection views supported by Notion */
export type CollectionViewType =
  | 'table'
  | 'gallery'
  | 'list'
  | 'board'
  | 'calendar'
  | 'timeline';

export type CollectionCardCoverType =
  | 'page_cover'
  | 'page_content'
  | 'property'
  | 'none'
  | 'file';

interface FilterItem {
  property: PropertyID;
  operator: FileterOperatorType; // 与属性对应的类型一一对应
  valueType: 'exact' | 'relative'; // 一般情况下是 exact，目前是如果是date类型，才会出现exact
  value?: string | number | boolean;
}

interface Filter {
  operator: 'and' | 'or';
  list: (Filter | FilterItem)[];
}

type Sort = { property: PropertyID; direction: 'descend' | 'ascend' };



export interface BaseCollectionView {
  id: ID;
  type: CollectionViewType;
  name: string; // 视图的名称
  format: any; // 每个视图个性化的配置

  version: number;
  alive: boolean;
  parent_id: ID;
  parent_table: string; // 'block'
  space_id?: string; // TODO: 去掉?

  query: {
    filter?: Filter;
    sort?: Sort[];
    group_by: PropertyID;
  };

  page_sort: ID[]; // database中每条数据是作为block存在的，这里存的是顺序关系，保存在collection_view中
}

export interface TableCollectionView extends BaseCollectionView {
  type: 'table';

  format: {
    table_wrap: boolean;

    table_properties: Array<{
      property: PropertyID;
      visible: boolean;
      width: number;
    }>;

    table_groups: { property: PropertyID; visible: boolean }[];
  };
}

export type CollectionCardCoverSize = 'small' | 'medium' | 'large';
export type CollectionCardCoverAspect = 'cover' | 'contain';
export interface CollectionCardCover {
  type: CollectionCardCoverType;
  property?: PropertyID;
}

export interface BoardCollectionView extends BaseCollectionView {
  type: 'board';
  format: {
    board_cover: CollectionCardCover;
    board_cover_size: CollectionCardCoverSize;
    board_cover_aspect: CollectionCardCoverAspect;

    board_properties: Array<{
      property: PropertyID;
      visible: boolean;
    }>;

    board_groups: Array<{
      property: PropertyID;
      hidden: boolean;
      value: {
        type: PropertyType;
        value: string;
      };
    }>;
  };
}

export interface GalleryCollectionView extends BaseCollectionView {
  type: 'gallery';
  format: {
    gallery_cover: CollectionCardCover;
    gallery_cover_size: CollectionCardCoverSize;
    gallery_cover_aspect: CollectionCardCoverAspect;

    gallery_properties: { property: PropertyID; visible: boolean }[];
  };
}

export interface ListCollectionView extends BaseCollectionView {
  type: 'list';
  format: {
    list_properties: Array<{
      property: PropertyID;
      visible: boolean;
    }>;
  };
}

export interface CalendarCollectionView extends BaseCollectionView {
  type: 'calendar';

  format: {
    calendar_properties: Array<{
      property: PropertyID;
      visible: boolean;
    }>;

    calendar_groups: Array<{
      property: PropertyID;
      hidden: boolean;
      value: {
        type: PropertyType;
        value: string;

        // TODO: needs testing for more cases
      };
    }>;
  };
}

export interface TimelineCollectionView extends BaseCollectionView {
  type: 'timeline';

  format: {
    timeline_properties: Array<{
      property: PropertyID;
      visible: boolean;
    }>;

    timeline_groups: Array<{
      property: PropertyID;
      hidden: boolean;
      value: {
        type: PropertyType;
        value: string;

        // TODO: needs testing for more cases
      };
    }>;
  };
}

export type CollectionView =
  | TableCollectionView
  | GalleryCollectionView
  | ListCollectionView
  | BoardCollectionView
  | CalendarCollectionView
  | TimelineCollectionView;
