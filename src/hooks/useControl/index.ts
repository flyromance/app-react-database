import { useCallback, useEffect, useState } from 'react';

interface Option {
  valuePropName?: string;
  changePropName?: string;
  defalutValuePropName?: string;
  defaultValue?: any;
}

export const useControl = (props: object, option: Option) => {
  const {
    valuePropName = 'value',
    defalutValuePropName = 'defaultValue',
    changePropName = 'onChange',
    defaultValue: innerDefaultValue,
  } = option;

  const isControlled = valuePropName in props;
  const valueOnProps = props[valuePropName];
  const changeOnProps = props[changePropName];
  const defaultValue = props[defalutValuePropName] ?? innerDefaultValue;

  const [value, setValue] = useState(
    isControlled ? valueOnProps : defaultValue
  );
  const state = isControlled ? valueOnProps : value;

  const setState = useCallback(
    (v, ...args) => {
      setValue(v);
      if (isControlled) {
        changeOnProps(v, ...args);
      }
    },
    [changeOnProps]
  );

  return [state, setState];
};

export default useControl;
