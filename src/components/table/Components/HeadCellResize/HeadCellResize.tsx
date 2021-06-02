import * as React from 'react';

import { resizeColumn } from '../../actionCreators';
import defaultOptions from '../../defaultOptions';
import { IHeadCellResizeProps } from '../../props';
import {
  getMinWidth, getMouseMove, getValidatedWidth, HeadCellResizeStateAction, isNumberWidth,
} from '../../Utils/CellResizeUtils';
import { getElementCustomization } from '../../Utils/ComponentUtils';
import { getEventListenerEffect } from '../../Utils/EffectUtils';

const HeadCellResize: React.FunctionComponent<IHeadCellResizeProps> = (props) => {
  const {
    column: { key, style },
    dispatch,
    currentWidth,
    childComponents
  } = props;
  const minWidth = getMinWidth(style);

  const { elementAttributes, content } = getElementCustomization({
    className: defaultOptions.css.theadCellResize,
    draggable: false,
    onMouseDown: (mouseDownEvent: any) => {
      mouseDownEvent.preventDefault();
      const startX = mouseDownEvent.screenX - (isNumberWidth(currentWidth) ? currentWidth : mouseDownEvent.currentTarget.parentElement.offsetWidth);
      const mouseMoveStop = getEventListenerEffect('mousemove', getMouseMove(currentWidth, minWidth, startX, dispatch));
      const mouseUpStop = getEventListenerEffect('mouseup', (event: MouseEvent) => {
        const newWidth = getValidatedWidth(event.screenX - startX, minWidth);
        dispatch(resizeColumn(key, newWidth));
        dispatch({ type: HeadCellResizeStateAction, width: newWidth });
        mouseUpStop();
        mouseMoveStop();
      });
    }
  }, props, childComponents.headCellResize);

  return (
    <div {...elementAttributes}>{content || <>&nbsp;</>}</div>
  );
};

export default HeadCellResize;
