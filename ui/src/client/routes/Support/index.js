/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DataTable } from 'carbon-components-react';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import InlineCheckbox from 'carbon-components-react/lib/components/InlineCheckbox';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} = DataTable;

export default function Support() {
  return (
    <Content id="main-content">
      <FormattedMessage id="support.greeting" defaultMessage="Support" />
      <section>
        <h2>Sync</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>GitHub Repo</TableHeader>
              <TableHeader>Labels</TableHeader>
              <TableHeader>Milestones</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
              <TableCell>
                <InlineCheckbox label="Hi" />
              </TableCell>
              <TableCell>
                <InlineCheckbox label="Hi" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </Content>
  );
}
