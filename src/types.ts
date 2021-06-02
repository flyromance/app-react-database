import * as types from './base-types'

export interface DataItem {
  [key: string]: any;
}

interface Data {
  list: DataItem[];
  pageSize: number;
}

type ID = string;

// 业务类型字段
enum ColumnTypeEnum {
  Title = 1, // 每个表格第一列
  Text,
  Number,
  SingleSelect,
  MultiSelect,
  Checkbox,
  Date,
  Url,
  File,
}

type PrimitiveType = number | string | boolean;

type Option = {
  value: string | string | boolean;
  lable: string;
};

interface Column {
  title: string;
  key: string; // 业务字段
  type: ColumnTypeEnum; // 列属性
  options?: Option[];
  // visible: boolean; // 不能放这里，因为每个view都不一样
  width?: number;
}

interface FilterItem {
  key: string;
  operator: '';
  value: '';
}

interface Filter {
  type: 'and' | 'or';
  list: (FilterItem | Filter)[];
}

interface Sorter {
  key: string;
  direaction: 'ascend' | 'descend';
}

interface Group {
  key: string;
}

interface Collection {
  id: string;
  version: number;
  title: string;
  columns: Column[];
  parent_id: string;
  parent_type: string;
  data: DataItem[];
  sorters: Sorter[]; // 有顺序
  filter: Filter[]; //
  groups: Group[]; // 有顺序
}

export type CollectionViewType =
  | 'table'
  | 'gallery'
  | 'list'
  | 'board'
  | 'calendar'
  | 'timeline';

export interface BaseCollectionView {
  id: ID;
  type: CollectionViewType;
  name: string;
  format: any;

  version: number;
  alive: boolean;
  parent_id: ID;
  parent_table: string;
}

interface TableProperty {
  property: string;
  visible: boolean;
  width: number;
}

export interface TableCollectionView extends BaseCollectionView {
  type: CollectionViewType;

  format: {
    properties: TableProperty[];
  };

  query: {
    filter?: Filter;
    aggregations?: object[];
    group?: Group;
  };
}

export interface CollectionViewProps {
  collection: types.Collection
  collectionView: types.CollectionView
  collectionData: types.CollectionQueryResult
  padding: number
  width: number
}

export interface CollectionCardProps {
  collection: types.Collection
  block: types.PageBlock
  cover: types.CollectionCardCover
  coverSize: types.CollectionCardCoverSize
  coverAspect: types.CollectionCardCoverAspect
  properties?: Array<{
    property: types.PropertyID
    visible: boolean
  }>
  className?: string
}