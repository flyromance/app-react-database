// @ts-nocheck
import { AllHTMLAttributes } from 'react';

import { ITableProps } from '../';
import { SortingMode } from '../enums';
import { Column } from '../models';
import { ChildComponent } from '../Models/ChildComponent';
import { ChildAttributesItem, DispatchFunc } from '../types';
import { getValueByField } from './DataUtils';
import { filterAndSearchData } from './FilterUtils';
import { getGroupedData } from './GroupUtils';
import { getPageData, getPagesCount } from './PagingUtils';
import { isRemoteSorting, sortColumns, sortData } from './SortUtils';

export function extendProps<T = HTMLElement>(
  childElementAttributes: AllHTMLAttributes<T>,
  childProps: any,
  childComponent?: ChildComponent<any>): React.AllHTMLAttributes<T> {
    let resultProps = childElementAttributes;
    const childCustomAttributes = childComponent && childComponent.elementAttributes && childComponent.elementAttributes(childProps);
    if (childCustomAttributes) {
      const dispatch: DispatchFunc = childProps.dispatch;
      resultProps = mergeProps(childElementAttributes, childProps, childCustomAttributes, dispatch);
    }
    return resultProps;
};

const emptyFunc = () => {};
export function mergeProps<T = HTMLElement>(
  childElementAttributes: AllHTMLAttributes<T>,
  childProps: any,
  childCustomAttributes: ChildAttributesItem<any>,
  dispatch: DispatchFunc): React.AllHTMLAttributes<T> {
  const customPropsWithEvents: any = {};
  for (const prop in childCustomAttributes) {
    if (childCustomAttributes.hasOwnProperty(prop)) {
      const propName = prop as string;
      const propValue: any = (childCustomAttributes as any)[propName];
      const baseFunc = (childElementAttributes as any)[propName] || emptyFunc;
      if (typeof propValue === 'function') {
        customPropsWithEvents[prop] = (e: any) => {
          propValue(e, {
            baseFunc,
            childElementAttributes,
            childProps,
            dispatch,
          });
        };
      }
    }
  }

  const mergedResult: React.AllHTMLAttributes<T> = {
    ...childElementAttributes,
    ...childCustomAttributes,
    ...customPropsWithEvents,
    className: `${childElementAttributes.className || ''} ${childCustomAttributes.className || ''}`,
    style: { ...childElementAttributes.style, ...childCustomAttributes.style }
  };

  return mergedResult;
};

export const areAllFilteredRowsSelected = (props: ITableProps) => {
  const { selectedRows = [], rowKeyField } = props;
  return filterAndSearchData(props).every(d => selectedRows.includes(getValueByField(d, rowKeyField)))
}

export const areAllVisibleRowsSelected = (props: ITableProps) => {
  const { selectedRows = [], rowKeyField } = props;
  return getData(props).every(d => selectedRows.includes(getValueByField(d, rowKeyField)))
}

export const getData = (props: ITableProps) => {
  const {
    columns,
    groups,
    groupsExpanded,
    paging,
    sort,
    sortingMode = SortingMode.None,
  } = props;
  let {
    data = [],
  } = props;
  data = [...data];
  data = filterAndSearchData(props);
  if (!isRemoteSorting(sortingMode)){
    data = sortData(columns, data, sort);
  }

  const groupedColumns: Column[] = groups ? columns.filter((c) => groups.some((g) => g.columnKey === c.key)) : [];
  const groupedData = groups ? getGroupedData(data, groups, groupedColumns, groupsExpanded) : data;
  data = getPageData(groupedData, paging);

  return data;
};

export const getSelectedData = ({ data, selectedRows, rowKeyField }: ITableProps) => {
  return data ? data.filter(d => {
    const value = getValueByField(d, rowKeyField);
    return selectedRows?.some(v => v === value);
  }) : [];
}

export const getSortedColumns = (props: ITableProps): Column[] => {
  return sortColumns(props.columns);
};

export const getPagesCountByProps = (props: ITableProps) => {
  const {
    paging,
  } = props;
  let pagesCount = 1;
  if (paging && paging.enabled) {
    pagesCount = getPagesCount(filterAndSearchData(props), paging);
  }
  return pagesCount;
};

export const prepareTableOptions = (props: ITableProps) => {
  const {
    groups,
  } = props;
  let {
    columns,
  } = props;
  const groupedData = getData(props);
  let groupColumnsCount = 0;
  let groupedColumns: Column[] = [];
  if (groups) {
    groupColumnsCount = groups.length;
    groupedColumns = columns.filter((c) => groups.some((g) => g.columnKey === c.key));
    columns = columns.filter((c) => !groups.some((g) => g.columnKey === c.key));
  }
  columns = columns.filter((c) => c.visible !== false);
  return {
    columns,
    groupColumnsCount,
    groupedColumns,
    groupedData
  };
};

export const getDraggableProps = (
  key: any,
  dispatch: DispatchFunc,
  actionCreator: (draggableKeyValue: any, targetKeyValue: any) => any,
  draggedClass: string,
  dragOverClass: string,
): ChildAttributesItem<any> => {
  let count: number = 0;
  return {
    draggable: true,
    onDragStart: (event) => {
      count = 0;
      event.dataTransfer.setData('ka-draggableKeyValue', JSON.stringify(key));
      event.currentTarget.classList.add(draggedClass);
      event.dataTransfer.effectAllowed = 'move';
    },
    onDragEnd: (event) => {
      event.currentTarget.classList.remove(draggedClass);
    },
    onDrop: (event) => {
      event.currentTarget.classList.remove(dragOverClass);
      const draggableKeyValue = JSON.parse(event.dataTransfer.getData('ka-draggableKeyValue'));
      dispatch(actionCreator(draggableKeyValue, key));
    },
    onDragEnter: (event) => {
      count++;
      if (!event.currentTarget.classList.contains(dragOverClass)){
        event.currentTarget.classList.add(dragOverClass);
      }
      event.preventDefault();
    },
    onDragLeave: (event) => {
      count--;
      if (count === 0){
        event.currentTarget.classList.remove(dragOverClass);
      }
    },
    onDragOver: (event) => {
      if (!event.currentTarget.classList.contains(dragOverClass)){
        event.currentTarget.classList.add(dragOverClass);
      }
      event.preventDefault();
    }
  };
}
