/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Button, DataTable } from 'carbon-components-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const {
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} = DataTable;

export default function UsersTable({ rows }) {
  const headers = [
    {
      key: 'name',
      header: (
        <FormattedMessage id="manage.users.header.name" defaultMessage="Name" />
      ),
    },
    {
      key: 'email',
      header: (
        <FormattedMessage
          id="manage.users.header.email"
          defaultMessage="Email"
        />
      ),
    },
    {
      key: 'username',
      header: (
        <FormattedMessage
          id="manage.users.header.username"
          defaultMessage="Username"
        />
      ),
    },
    {
      key: 'createdAt',
      header: (
        <FormattedMessage
          id="manage.users.header.created_at"
          defaultMessage="Created at"
        />
      ),
    },
    {
      key: 'updatedAt',
      header: (
        <FormattedMessage
          id="manage.users.header.updated_at"
          defaultMessage="Updated at"
        />
      ),
    },
  ];

  return (
    <DataTable headers={headers} rows={rows}>
      {({ rows, headers, getHeaderProps }) => (
        <TableContainer title="Users">
          <Table>
            <TableHead>
              <TableRow>
                {headers.map(header => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}{' '}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  {row.cells.map(cell => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
}
