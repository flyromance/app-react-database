import React from 'react';
import * as types from '../base-types';
import { getBlockParentPage, getTextContent } from '../base-utils';
import { useLocalStorage, useWindowSize } from 'react-use';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import classnames from 'classnames';

import { CollectionViewIcon } from '../icons/collection-view-icon';
import { ChevronDownIcon } from '../icons/chevron-down-icon';
import { CollectionView } from './collection-view';
// import { PageIcon } from './page-icon';
// import { useNotionContext } from '../context';

const isServer = typeof window === 'undefined';
const triggers = ['click'];

const CollectionViewColumnDesc: React.FC<{
  collectionView: types.CollectionView;
  className?: string;
  children?: React.ReactNode;
}> = ({ collectionView, className, children, ...rest }) => {
  const { type } = collectionView;
  const name =
    collectionView.name || `${type[0].toUpperCase()}${type.slice(1)} view`;

  return (
    <div className={classnames('notion-collection-view-type', className)} {...rest}>
      <CollectionViewIcon
        className="notion-collection-view-type-icon"
        type={type}
      />

      <span className="notion-collection-view-type-title">{name}</span>

      {children}
    </div>
  );
};

const recordMap = {
  collection: {
    123: {
      value: {

      }
    }
  },
  collection_view: {
    123: {
      value: {

      }
    }
  },
  collection_query: {
    123: {
      value: {

      }
    }
  }
};

export const Collection: React.FC<{
  block: types.CollectionViewBlock | types.CollectionViewPageBlock;
  className?: string;
  recordMap: any;
}> = ({ block, className }) => {
  // const { recordMap } = useNotionContext();

  const { collection_id: collectionId, view_ids: viewIds } = block;

  // const [collectionState, setCollectionState] = useLocalStorage(block.id, {
  //   collectionViewId: viewIds[0],
  // });

  const collectionViewId = viewIds[0];

  // const onChangeView = React.useCallback(
  //   ({ key: collectionViewId }) => {
  //     console.log('change collection view', collectionViewId);

  //     setCollectionState({
  //       ...collectionState,
  //       collectionViewId,
  //     });
  //   },
  //   [collectionState]
  // );

  let { width } = useWindowSize();
  if (isServer) {
    width = 1024;
  }

  // TODO: customize for mobile?
  // const maxNotionBodyWidth = 708;
  // let notionBodyWidth = maxNotionBodyWidth;

  // const parentPage = getBlockParentPage(block, recordMap);
  // if (parentPage?.format?.page_full_width) {
  //   notionBodyWidth = (width - 2 * Math.min(96, width * 0.08)) | 0;
  // } else {
  //   notionBodyWidth =
  //     width < maxNotionBodyWidth
  //       ? (width - width * 0.02) | 0 // 2vw
  //       : maxNotionBodyWidth;
  // }

  // const padding = isServer ? 96 : ((width - notionBodyWidth) / 2) | 0;
  // console.log({ width, notionBodyWidth, padding })

  const collection = recordMap.collection[collectionId]?.value;
  const collectionView = recordMap.collection_view[collectionViewId]?.value;
  const collectionData =
    recordMap.collection_query[collectionId]?.[collectionViewId];

  if (!(collection && collectionView && collectionData)) {
    console.log('skipping missing collection view for block', block.id);
    return null;
  }

  // const style: React.CSSProperties = {};
  // if (collectionView.type === 'table' || collectionView.type === 'board') {
  //   style.paddingLeft = padding;
  //   style.paddingRight = padding;
  // }

  // const title = getTextContent(collection.name).trim();
  // if (collection.icon) {
  //   block.format = {
  //     ...block.format,
  //     page_icon: collection.icon,
  //   };
  // }

  return (
    <div className={classnames('next-space-collection', className)}>
      <div className="next-space-collection-header">
        {/* {title && (
          <div className="notion-collection-header-title">
            <>
              <PageIcon
                block={block}
                className="notion-page-title-icon"
                hideDefaultIcon
              />
              {title}
            </>
          </div>
        )} */}

        {false && (
          <Dropdown
            trigger={triggers}
            overlay={
              <Menu onSelect={() => {}}>
                {viewIds.map((viewId) => (
                  <MenuItem
                    key={viewId}
                    className="next-space-collection-view-type-menu-item"
                  >
                    {/* <CollectionViewColumnDesc
                      collectionView={recordMap.collection_view[viewId]?.value}
                    /> */}
                  </MenuItem>
                ))}
              </Menu>
            }
            animation="slide-up"
          >
            <CollectionViewColumnDesc
              className="next-space-collection-view-dropdown"
              collectionView={collectionView}
            >
              <ChevronDownIcon className="next-space-collection-view-dropdown-icon" />
            </CollectionViewColumnDesc>
          </Dropdown>
        )}
      </div>

      <CollectionView
        collection={collection}
        collectionView={collectionView}
        collectionData={collectionData}
        padding={padding}
        width={width}
      />
    </div>
  );
};
