import {
  ID,
  Decoration,
  Color,
  NumberFormat,
  PropertyID,
  PropertyType,
} from './core';

import { Formula } from './formula';

export interface SelectOption {
  id: ID;
  color: Color;
  value: string;
}

export interface CollectionPropertySchema {
  name: string;
  type: PropertyType;
  options?: SelectOption[]; // 这里的顺序可以在boardview和table中输入值时创建或修改顺序
  number_format?: NumberFormat;
  formula?: Formula;
}

export interface CollectionPropertySchemaMap {
  [key: string]: CollectionPropertySchema;
}

export interface Collection {
  id: ID;
  version: number;
  name: Decoration[];
  schema: CollectionPropertySchemaMap;

  icon: string;
  parent_id: ID;
  parent_table: string; // block space table
  alive: boolean;
  copied_from: string;
  template_pages?: Array<ID>;


  format?: {

    // 如果是 collection_view_page 时，column的顺序
    collection_page_properties?: Array<{
      property: PropertyID;
      visible: boolean;
    }>;
    // property_visibility?: Array<{
    //   property: PropertyID
    //   visibility: 'show' | 'hide'
    // }>
  };
}
