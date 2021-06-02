import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import classnames from 'classnames';
import styled from 'styled-components';

import * as types from '../../src/base-types';

import { Collection } from '../../src';
import './app.scss';

const Wrapper = styled.div`
  display: flex;
`;

const routeInfo = [
  {
    href: '/all',
    title: 'all-features',
    component: Collection,
  },
];

const SideBar = styled(({ className }) => {
  return (
    <div className={classnames(className)}>
      <ul>
        {routeInfo.map(({ href, title }) => (
          <li key={title}>
            <Link to={`${href}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
})`
  width: 200px;
`;

const Main = styled.div`
  flex: 1;
  margin: 20px;
`;

const blockData: types.CollectionViewPageBlock = {
  id: '123',
  type: 'collection_view_page',
  version: 123,
  collection_id: '123',
  view_ids: ['123'],
  parent_id: '1233',
  parent_table: 'block',
  format: {},

  permissions: [
    {
      role: 'editor',
      type: '123',
    },
  ],
  created_time: new Date().getTime(),
  last_edited_time: new Date().getTime(),
  alive: true,
  created_by_table: '123123',
  created_by_id: '123123',
  last_edited_by_table: '123132',
  last_edited_by_id: '12313',
};

const recordMap: types.RecordMap = {
  block: {
    '0be6efce-9daf-4268-8f65-c76b89f8eb27': {
      role: 'reader',
      value: {
        type: 'collection_view_page',
        collection_id: '1234',
        view_ids: ['123'],
        alive: true,
        properties: {
          title: [['string']],
        },
        format: {
          page_cover: '123',
        },
        permissions: [{ role: 'editor', type: '123' }],
        id: '0be6efce-9daf-4268-8f65-c76b89f8eb27',
        created_by_id: 'db401f86-4012-4d18-9445-236978ef32df',
        created_by_table: 'notion_user',
        created_time: 1597783948588,
        last_edited_by_id: 'db401f86-4012-4d18-9445-236978ef32df',
        last_edited_by_table: 'notion_user',
        last_edited_time: 1598149980000,
        parent_id: 'e375c183-5037-435e-b169-e88d14a9ffa2',
        parent_table: 'block',
        space_id: '123123132',
        version: 90,
      },
    },
  },
  collection: {
    123: {
      role: 'editor',
      value: {
        id: '123',
        version: 12,
        name: [['123']],
        schema: {
          ddd: {
            name: 'ddd',
            type: 'text',
            options: [{ id: '123', color: 'blue', value: '123' }],
            
          },
        },
        icon: '123',
        parent_id: '0be6efce-9daf-4268-8f65-c76b89f8eb27',
        parent_table: 'block',
        alive: true,
        copied_from: '123',

      },
    },
  },
  collection_view: {
    123: {
      role: 'editor',
      value: {
        type: 'table',
        id: '123',
        version: 1,
        format: {
          table_properties: {

          }
        }
      },
    },
  },
  // collection_query: {
  //   123: {
  //     value: {},
  //   },
  // },
};

const App = () => {
  return (
    <BrowserRouter>
      <Wrapper>
        <SideBar />
        <Main>
          <div>
            {routeInfo.map(({ component, href, title }) => {
              return (
                <Route
                  key={href}
                  path={href}
                  exact
                  render={() =>
                    React.createElement(component, {
                      block: blockData,
                      recordMap,
                    })
                  }
                />
              );
            })}
          </div>
        </Main>
      </Wrapper>
    </BrowserRouter>
  );
};

export default App;
