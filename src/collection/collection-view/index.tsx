import React, { useEffect } from 'react';

import { CollectionViewProps } from '../../types';
import { CollectionViewTable } from '../collection-view-table';


export const CollectionView: React.FC<CollectionViewProps> = (props) => {
  const { collectionView } = props;
  // useEffect(() => {
  //   setTimeout(() => {}, 1000);
  // });

  switch (collectionView.type) {
    case 'table':
      return <CollectionViewTable {...props} />

    default:
      console.warn('unsupported collection view', collectionView)
      return null
  }
};

export default CollectionView;
