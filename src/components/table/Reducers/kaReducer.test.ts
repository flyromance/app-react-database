import { ITableProps } from '../';
import {
  clearSingleAction, deleteRow, deselectAllFilteredRows, deselectAllRows, deselectAllVisibleRows,
  deselectRow, loadData, reorderColumns, reorderRows, selectAllFilteredRows, selectAllRows,
  selectAllVisibleRows, selectRowsRange, selectSingleRow, setSingleAction, updateData,
} from '../actionCreators';
import { ActionType, FilterOperatorName } from '../enums';
import { kaReducer } from './kaReducer';

describe('kaReducer', () => {
  describe('SelectRowsRange', () => {
    const intialState = {
      data: [
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
      ],
      columns: [{ key: 'key' }],
      rowKeyField: 'key',
    };
    it('default', () => {
      const result: ITableProps = kaReducer(intialState, selectRowsRange(2, 4));
      expect(result.selectedRows).toMatchSnapshot();
    });
    it('revert set', () => {
      const result: ITableProps = kaReducer(intialState, selectRowsRange(4, 2));
      expect(result.selectedRows).toMatchSnapshot();
    });
    it('rowKeyValueTo is not specified', () => {
      const result: ITableProps = kaReducer(intialState, selectRowsRange(2, null));
      expect(result.selectedRows).toMatchSnapshot();
    });
    it('skip if rowKeyValueTo is not found', () => {
      const result: ITableProps = kaReducer(intialState, selectRowsRange(2, 7));
      expect(result.selectedRows).toMatchSnapshot();
    });
    it('skip if rowKeyValue is not found', () => {
      const result: ITableProps = kaReducer(intialState, selectRowsRange(7, 2));
      expect(result.selectedRows).toMatchSnapshot();
    });
  });
  describe('ReorderColumns', () => {
    it('default', () => {
      const intialState = {
        columns: [
          { key: '1' },
          { key: '2' },
          { key: '3' },
          { key: '4' },
        ],
        rowKeyField: 'id',
      };
      const result = kaReducer(intialState, reorderColumns('1', '3'));
      expect(result).toMatchSnapshot();
    });
  });
  describe('ReorderRows', () => {
    it('default', () => {
      const intialState = {
        data: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
        ],
        rowKeyField: 'id',
      };
      const result = kaReducer(intialState, reorderRows(1, 3));
      expect(result).toMatchSnapshot();
    });
    it('inner keys', () => {
      const intialState = {
        data: [
          { a: { id: 1 } },
          { a: { id: 2 } },
          { a: { id: 3 } },
          { a: { id: 4 } },
        ],
        rowKeyField: 'a.id',
      };
      const result = kaReducer(intialState, reorderRows(1, 3));
      expect(result).toMatchSnapshot();
    });
  });
  it('ScrollTable', () => {
    const scrollTop = 10;
    const intialState = {
      columns: [],
      data: [],
      rowKeyField: '',
    };
    const newState = kaReducer(intialState, { type: ActionType.ScrollTable, scrollTop });
    expect(newState).toEqual({ ...intialState, virtualScrolling: { scrollTop } });
  });
  it('SelectAllRows', () => {
    const intialState = {
      columns: [],
      data: [{ id: 1 }, { id: 2 }],
      rowKeyField: 'id',
    };
    const newState = kaReducer(intialState, selectAllRows());
    expect(newState).toEqual({ ...intialState, selectedRows: [1, 2] });
  });
  describe('SelectAllFilteredRows', () => {
    it('filter only', () => {
      const intialState: ITableProps = {
        columns: [{ key: 'id', filterRowValue: 2, filterRowOperator: FilterOperatorName.LessThanOrEqual }],
        data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        rowKeyField: 'id',
      };
      const newState = kaReducer(intialState, selectAllFilteredRows());
      expect(newState).toEqual({ ...intialState, selectedRows: [1, 2] });
    });
    it('search', () => {
      const intialState: ITableProps = {
        columns: [{ key: 'id' }],
        data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        rowKeyField: 'id',
        searchText: '1',
      };
      const newState = kaReducer(intialState, selectAllFilteredRows());
      expect(newState).toEqual({ ...intialState, selectedRows: [1] });
    });
  });

  describe('SelectAllVisibleRows', () => {
    it('default', () => {
      const intialState: ITableProps = {
        columns: [{ key: 'id', filterRowValue: 3, filterRowOperator: FilterOperatorName.LessThanOrEqual }],
        data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        rowKeyField: 'id',
        paging: {
          enabled: true,
          pageSize: 2
        }
      };
      const newState = kaReducer(intialState, selectAllVisibleRows());
      expect(newState).toEqual({ ...intialState, selectedRows: [1, 2] });
    });
  });
  describe('DeselectAllVisibleRows', () => {
    it('default', () => {
      const intialState: ITableProps = {
        columns: [{ key: 'id', filterRowValue: 4, filterRowOperator: FilterOperatorName.LessThanOrEqual }],
        data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
        selectedRows: [1, 2, 3, 5],
        rowKeyField: 'id',
        paging: {
          enabled: true,
          pageSize: 2
        }
      };
      const newState = kaReducer(intialState, deselectAllVisibleRows());
      expect(newState).toEqual({ ...intialState, selectedRows: [3, 5] });
    });
  });

  describe('DeselectAllFilteredRows', () => {
    it('filter only', () => {
      const intialState: ITableProps = {
        columns: [{ key: 'id', filterRowValue: 2, filterRowOperator: FilterOperatorName.LessThanOrEqual }],
        data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        selectedRows: [1, 2, 3],
        rowKeyField: 'id',
      };
      const newState = kaReducer(intialState, deselectAllFilteredRows());
      expect(newState).toEqual({ ...intialState, selectedRows: [3] });
    });
    it('search', () => {
      const intialState: ITableProps = {
        columns: [{ key: 'id' }],
        data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        rowKeyField: 'id',
        selectedRows: [1, 2, 3],
        searchText: '1',
      };
      const newState = kaReducer(intialState, deselectAllFilteredRows());
      expect(newState).toEqual({ ...intialState, selectedRows: [2, 3] });
    });
  });
  it('SelectSingleRow', () => {
    const intialState = {
      columns: [],
      data: [{ id: 1 }, { id: 2 }],
      rowKeyField: 'id',
      selectedRows: [1],
    };
    const newState = kaReducer(intialState, selectSingleRow(2));
    expect(newState).toEqual({ ...intialState, selectedRows: [2] });
  });
  it('DeleteRow', () => {
    const intialState = {
      columns: [],
      data: [{ id: 1 }, { id: 2 }],
      rowKeyField: 'id',
    };
    const newState = kaReducer(intialState, deleteRow(2));
    expect(newState).toEqual({ ...intialState, data: [{ id: 1 }] });
  });
  it('DeselectAllRows', () => {
    const intialState = {
      columns: [],
      data: [{ id: 1 }, { id: 2 }],
      rowKeyField: 'id',
      selectedRows: [1, 2],
    };
    const newState = kaReducer(intialState, deselectAllRows());
    expect(newState).toEqual({ ...intialState, selectedRows: [] });
  });
  it('DeselectRow', () => {
    const intialState = {
      columns: [],
      data: [{ id: 1 }, { id: 2 }],
      rowKeyField: 'id',
      selectedRows: [1, 2],
    };
    const newState = kaReducer(intialState, deselectRow(2));
    expect(newState).toEqual({ ...intialState, selectedRows: [1] });
  });
  it('UpdateData', () => {
    const newData =  [{ id: 3 }, { id: 4 }];
    const intialState = {
      columns: [],
      data: [{ id: 1 }, { id: 2 }],
      rowKeyField: 'id',
      selectedRows: [1, 2],
    };
    const newState = kaReducer(intialState, updateData(newData));
    expect(newState.data).toEqual(newData);
  });
  it('ShowLoading', () => {
    const intialState = {
      loading: {
        enabled: false,
        text: 'test'
      }
    };
    const newState = kaReducer(intialState, { type: ActionType.ShowLoading });
    expect(newState.loading.enabled).toEqual(true);
    expect(newState.loading.text).toEqual('test');
  });
  it('ShowLoading - change text', () => {
    const intialState = {
      loading: {
        enabled: false,
        text: 'test'
      }
    };
    const newState = kaReducer(intialState, { type: ActionType.ShowLoading, text: '2' });
    expect(newState.loading.enabled).toEqual(true);
    expect(newState.loading.text).toEqual('2');
  });
  it('HideLoading', () => {
    const intialState = {
      loading: {
        enabled: true,
        text: 'test'
      }
    };
    const newState = kaReducer(intialState, { type: ActionType.HideLoading });
    expect(newState.loading.enabled).toEqual(false);
    expect(newState.loading.text).toEqual('test');
  });
  it('HideLoading', () => {
    const intialState = {
      loading: {
        enabled: true,
        text: 'test'
      }
    };
    const newState = kaReducer(intialState, { type: ActionType.HideLoading });
    expect(newState.loading.enabled).toEqual(false);
    expect(newState.loading.text).toEqual('test');
  });
  it('UpdatePageIndex', () => {
    const intialState = {
      paging: {
        enabled: true,
        pageIndex: 2,
      }
    };
    const newState = kaReducer(intialState, { type: ActionType.UpdatePageIndex, pageIndex: 5 });
    expect(newState.paging.enabled).toEqual(true);
    expect(newState.paging.pageIndex).toEqual(5);
  });
  it('SetSingleAction', () => {
    const intialState = { };
    const newState = kaReducer(intialState, setSingleAction(loadData()));
    expect(newState.singleAction).toMatchSnapshot();
  });
  it('ClearSingleAction', () => {
    const intialState = {
      singleAction: loadData(),
    };
    const newState = kaReducer(intialState, clearSingleAction());
    expect(newState.singleAction).toBeUndefined();
  });
});
