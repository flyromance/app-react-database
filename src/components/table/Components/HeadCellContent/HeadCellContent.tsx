import * as React from 'react';

import { updateSortDirection } from '../../actionCreators';
import defaultOptions from '../../defaultOptions';
import { SortDirection } from '../../enums';
import { IHeadCellProps } from '../../props';
import { getElementCustomization } from '../../Utils/ComponentUtils';
import { isSortingEnabled } from '../../Utils/SortUtils';
import { classNames } from '../../Utils/cls';

import { Popup } from 'next-space-popup';

const HeadCellContent: React.FunctionComponent<IHeadCellProps> = (props) => {
  const {
    column,
    dispatch,
    sortingMode,
    childComponents: { headCellContent },
  } = props;
  const sortingEnabled = isSortingEnabled(sortingMode);

  // 点击应出现下拉框
  // const onClick = sortingEnabled ? () => {
  //   dispatch(updateSortDirection(column.key));
  // } : undefined;

  const { elementAttributes, content } = getElementCustomization(
    {
      className: classNames(
        defaultOptions.css.theadCellContent,
        sortingEnabled ? 'ka-pointer' : ''
      ),
      // onClick,
    },
    props,
    headCellContent
  );

  return (
    <div {...elementAttributes}>
      
      {/* {column.sortDirection && sortingEnabled && (
        <span
          className={
            column.sortDirection === SortDirection.Ascend
              ? defaultOptions.css.iconSortArrowUp
              : defaultOptions.css.iconSortArrowDown
          }
        >
          {column.sortIndex}
        </span>
      )} */}
      <Popup
        trigger={
          <>{content || <span>{column.title}</span>}</>
        }
        position={['top center', 'bottom right', 'bottom left']}
        closeOnDocumentClick
        keepTooltipInside=".tooltipBoundary"
      >
        Tooltip content
      </Popup>
    </div>
  );
};

export default HeadCellContent;
