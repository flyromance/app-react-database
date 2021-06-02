import dayjs from 'dayjs';
// import isToday from 'dayjs/plugin/isToday';
// dayjs.extend(isToday);

import { PropertyType } from './core';

function isPlainObject(target) {
  return (
    Object.prototype.toString.call(target).slice(8, -1).toLowerCase() ===
    'object'
  );
}

// undefined | null | string | number | any[] | object
function isEmptyValue(target) {
  if (typeof target == null) return true;
  if (typeof target === 'string') return !target.length;
  if (typeof target === 'number') return Number.isNaN(target); // TODO: NaN 是否是空
  if (Array.isArray(target)) {
    return target.every((t) => isEmptyValue(t));
  }
  if (isPlainObject(target)) {
    for (let key in target) {
      return false;
    }
    return true;
  }
  // TODO: set map ?
  return false;
}

function relativeToTimestamp(v: string) {
  switch (v) {
    case 'today': {
      return [dayjs().startOf('day').unix(), dayjs().endOf('day').unix()];
    }
    case 'tomorrow': {
      return [
        dayjs().add(1, 'day').startOf('day').unix(),
        dayjs().add(1, 'day').endOf('day').unix(),
      ];
    }
    case 'yesterday': {
      return [
        dayjs().subtract(1, 'day').startOf('day').unix(),
        dayjs().subtract(1, 'day').endOf('day').unix(),
      ];
    }
    case 'one_week_ago': {
      return [dayjs().subtract(7, 'day').unix(), dayjs().unix()];
    }
    case 'one_week_from_now': {
      return [dayjs().unix(), dayjs().subtract(7, 'day').unix()];
    }
  }
}

type StringValueType = string | undefined;
type NumberValueType = number | undefined;
type CheckboxValueType = 'Yes' | 'No' | undefined;

type FilterOperatorConfigType = {
  [key: string]: {
    label: string;
    limit: PropertyType[];
    handler: (...args: any[]) => boolean;
  };
};

const filterOperatorConfig: FilterOperatorConfigType = {
  is_empty: {
    label: '为空',
    limit: [
      'title',
      'text',
      'url',
      'number',
      'select',
      'multi_select',
      'file',
      'date',
    ],
    handler: (v) => isEmptyValue(v),
  },
  is_not_empty: {
    label: '不为空',
    limit: [
      'title',
      'text',
      'url',
      'number',
      'select',
      'multi_select',
      'file',
      'date',
    ],
    handler: (v) => !isEmptyValue(v),
  },
  string_is: {
    label: '等于',
    limit: ['title', 'text', 'url'],
    handler(target: StringValueType, value: StringValueType) {
      if (!value) return true;
      return target === value;
    },
  },
  string_not: {
    label: '不等于',
    limit: ['title', 'text', 'url'],
    handler(target: StringValueType, value: StringValueType) {
      if (!value) return true;
      return target ? target !== value : false;
    },
  },
  string_contains: {
    label: '包含',
    limit: ['title', 'text', 'url'],
    handler(target: StringValueType, value: StringValueType) {
      if (!value) return true;
      return target ? target.includes(value) : false;
    },
  },
  string_not_contains: {
    label: '不包含',
    limit: ['title', 'text', 'url'],
    handler(target: StringValueType, value: StringValueType) {
      if (!value) return true;
      return target ? !target.includes(value) : false;
    },
  },
  string_starts_with: {
    label: '开头为',
    limit: ['title', 'text', 'url'],
    handler(target: StringValueType, value: StringValueType) {
      if (!value) return true;
      return target ? target.startsWith(value) : false;
    },
  },
  string_ends_with: {
    label: '结束为',
    limit: ['title', 'text', 'url'],
    handler(target: StringValueType, value: StringValueType) {
      if (!value) return true;
      return target ? target.endsWith(value) : false;
    },
  },
  number_is: {
    label: '=',
    limit: ['number'],
    handler: (target: NumberValueType, value: NumberValueType) => {
      if (isEmptyValue(value)) return true;
      if (isEmptyValue(target)) return false;
      return target === value;
    },
  },
  number_is_not: {
    label: '≠',
    limit: ['number'],
    handler: (target: NumberValueType, value: NumberValueType) => {
      if (isEmptyValue(value)) return true;
      if (isEmptyValue(target)) return true;
      return target !== value;
    },
  },
  number_gt: {
    label: '>',
    limit: ['number'],
    handler: (target: NumberValueType, value: NumberValueType) => {
      if (isEmptyValue(value)) return true;
      if (isEmptyValue(target)) return false;
      return target > value;
    },
  },
  number_gte: {
    label: '≥',
    limit: ['number'],
    handler: (target: NumberValueType, value: NumberValueType) => {
      if (isEmptyValue(value)) return true;
      if (isEmptyValue(target)) return false;
      return target >= value;
    },
  },
  number_lt: {
    label: '<',
    limit: ['number'],
    handler: (target: NumberValueType, value: NumberValueType) => {
      if (isEmptyValue(value)) return true;
      if (isEmptyValue(target)) return false;
      return target < value;
    },
  },
  number_lte: {
    label: '≤',
    limit: ['number'],
    handler: (target: NumberValueType, value: NumberValueType) => {
      if (isEmptyValue(value)) return true;
      if (isEmptyValue(target)) return false;
      return target <= value;
    },
  },
  checkbox_is: {
    label: '等于',
    limit: ['checkbox'],
    handler(target: CheckboxValueType = 'No', value: CheckboxValueType) {
      if (!value) return true;
      return target === value;
    },
  },
  checkbox_is_not: {
    label: '不等于',
    limit: ['checkbox'],
    handler(target: CheckboxValueType = 'No', value: CheckboxValueType) {
      if (!value) return true;
      return target !== value;
    },
  },
  enum_is: {
    label: '等于',
    limit: ['select'],
    handler(target: undefined | string, value: undefined | string) {
      if (!value) return true;
      return target ? target === value : false;
    },
  },
  enum_is_not: {
    label: '不等于',
    limit: ['select'],
    handler(target: undefined | string, value: undefined | string) {
      if (!value) return true;
      return target ? target !== value : false;
    },
  },
  enum_contains: {
    label: '包含',
    limit: ['multi_select'],
    handler(target: undefined | string[], value: undefined | string[]) {
      if (!value || !value.length) return true;
      return target ? value.every((v) => target.includes(v)) : false;
    },
  },
  enum_not_contains: {
    label: '不包含',
    limit: ['multi_select'],
    handler(target: undefined | string[], value: undefined | string[]) {
      if (!value || !value.length) return true;
      return target ? value.every((v) => !target.includes(v)) : true;
    },
  },
  date_is: {
    label: '等于',
    limit: ['date'],
    // TODO: 是不是要设置 type字段
    handler(
      target: undefined | number,
      value: undefined | string | number,
      type: 'exact' | 'relative' // 是否是相对值，比如 today
    ) {
      if (!value) return true;
      if (!target) return false;
      if (type === 'exact') {
        // value 是手动设置的时间戳
        return dayjs(target).isSame(value);
      } else {
        const arr = relativeToTimestamp(value as string);
        return arr ? target >= arr[0] && target <= arr[1] : true;
      }
    },
  },
  date_is_before: {
    label: '早于',
    limit: ['date'],
    handler: (
      target: undefined | number,
      value: undefined | string,
      type: 'exact' | 'relative'
    ) => {
      if (!value) return true;
      if (!target) return false;
      if (type === 'exact') {
        // value 是手动设置的时间戳
        return dayjs(target).isBefore(value);
      } else {
        const arr = relativeToTimestamp(value as string);
        return arr ? target < arr[0] : true;
      }
    },
  },
  date_is_after: {
    label: '晚于',
    limit: ['date'],
    handler: (
      target: undefined | number,
      value: undefined | string,
      type: 'exact' | 'relative'
    ) => {
      if (!value) return true;
      if (!target) return false;
      if (type === 'exact') {
        // value 是手动设置的时间戳
        return dayjs(target).isAfter(value);
      } else {
        const arr = relativeToTimestamp(value as string);
        return arr ? target > arr[1] : true;
      }
    },
  },
};

export type FileterOperatorType = keyof typeof filterOperatorConfig;

interface OptionType {
  label: string;
  value: string;
}

const getFilterOptions = (
  propertyType: PropertyType,
  config = filterOperatorConfig
) => {
  return Object.keys(config).reduce((acc, key) => {
    const { limit, label } = config[key];
    if (limit.includes(propertyType)) {
      acc.push({
        value: key,
        label,
      });
    }
    return acc;
  }, [] as OptionType[]);
};

const DateValueOptions = [
  {
    value: 'custom',
    label: '指定日期',
  },
  {
    value: 'today',
    label: '今天',
  },
  {
    value: 'tomorrow',
    label: '明天',
  },
  {
    value: 'yesterday',
    label: '昨天',
  },
  {
    value: 'one_week_ago',
    label: '过去一周',
  },
  {
    value: 'one_week_from_now',
    label: '未来一周',
  },
];

export const TitleOperaterOptions = getFilterOptions('title');
export const TextOperaterOptions = getFilterOptions('text');
export const UrlOperaterOptions = getFilterOptions('url');
export const NumberOperaterOptions = getFilterOptions('number');
export const SelectOperaterOptions = getFilterOptions('select');
export const MultiSelectOperaterOptions = getFilterOptions('multi_select');
export const CheckboxOperaterOptions = getFilterOptions('checkbox');
export const DateOperaterOptions = getFilterOptions('date');
