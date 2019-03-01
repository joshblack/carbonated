/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Content } from 'carbon-components-react/lib/components/UIShell';
import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import UsersTable from './components/UsersTable';

export default function Manage() {
  return (
    <Content id="main-content">
      <h1>
        <FormattedMessage
          id="manage.users.title"
          defaultMessage="Manage users"
        />
      </h1>
      <Query query={USERS_QUERY}>
        {({ loading, error, data }) => {
          if (loading) {
            return 'Loading...';
          }

          if (error) {
            console.error(error);
            return 'Whoops! Something went wrong.';
          }

          return <UsersTable rows={data.users} />;
        }}
      </Query>
    </Content>
  );
}

const USERS_QUERY = gql`
  {
    users {
      id
      name
      email
      username
      createdAt
      updatedAt
    }
  }
`;
