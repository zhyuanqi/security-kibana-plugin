/*
 *   Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

import {
  EuiAvatar,
  EuiButtonEmpty,
  EuiContextMenuPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHeaderSectionItemButton,
  EuiHorizontalRule,
  EuiListGroup,
  EuiListGroupItem,
  EuiPopover,
  EuiText,
} from '@elastic/eui';
import { CoreStart } from 'kibana/public';
import React from 'react';
import { RoleInfoPanel } from './role-info-panel';
import { PasswordResetPanel } from './password-reset-panel';
import { TenantSwitchPanel } from './tenant-switch-panel';
import { ClientConfigType } from '../../types';
import { LogoutButton } from './log-out-button';
import { resolveTenantName } from '../configuration/utils/tenant-utils';

export function AccountNavButton(props: {
  coreStart: CoreStart;
  isInternalUser: boolean;
  username: string;
  tenant?: string;
  config: ClientConfigType;
}) {
  const [isPopoverOpen, setPopoverOpen] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<React.ReactNode>(null);
  const horizontalRule = <EuiHorizontalRule margin="xs" />;
  const username = props.username;
  const contextMenuPanel = (
    <div style={{ maxWidth: '256px' }}>
      <EuiFlexGroup gutterSize="s">
        <EuiFlexItem grow={null}>
          <EuiAvatar name={username} />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiListGroup gutterSize="none">
            <EuiListGroupItem
              key="username"
              wrapText
              label={
                <EuiText size="s">
                  <h5>{username}</h5>
                </EuiText>
              }
            />
          </EuiListGroup>
          <EuiListGroupItem
            color="subdued"
            key="tenant"
            label={<EuiText size="xs">{resolveTenantName(props.tenant || '', username)}</EuiText>}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      {horizontalRule}
      <EuiButtonEmpty
        data-test-subj="view-roles-and-identities"
        size="xs"
        onClick={() => setModal(<RoleInfoPanel {...props} handleClose={() => setModal(null)} />)}
      >
        View roles and identities
      </EuiButtonEmpty>
      {horizontalRule}
      <EuiButtonEmpty
        data-test-subj="switch-tenants"
        size="xs"
        onClick={() =>
          setModal(
            <TenantSwitchPanel
              coreStart={props.coreStart}
              config={props.config}
              handleClose={() => setModal(null)}
              handleSwitchAndClose={() => {
                setModal(null);
                window.location.reload();
              }}
            />
          )
        }
      >
        Switch tenants
      </EuiButtonEmpty>
      {props.isInternalUser && (
        <>
          {horizontalRule}
          <EuiButtonEmpty
            data-test-subj="reset-password"
            size="xs"
            onClick={() =>
              setModal(
                <PasswordResetPanel
                  coreStart={props.coreStart}
                  username={props.username}
                  handleClose={() => setModal(null)}
                  logoutUrl={props.config.auth.logout_url}
                />
              )
            }
          >
            Reset password
          </EuiButtonEmpty>
        </>
      )}
      <LogoutButton
        authType={props.config.auth.type}
        http={props.coreStart.http}
        divider={horizontalRule}
        logoutUrl={props.config.auth.logout_url}
      />
    </div>
  );
  return (
    <EuiHeaderSectionItemButton
      data-test-subj="account-header-section-button"
      onClick={() => {
        setPopoverOpen((prevState) => !prevState);
      }}
    >
      <EuiPopover
        id="actionsMenu"
        button={<EuiAvatar name={username} />}
        isOpen={isPopoverOpen}
        closePopover={() => {
          setPopoverOpen(false);
        }}
        panelPaddingSize="s"
      >
        <EuiContextMenuPanel>{contextMenuPanel}</EuiContextMenuPanel>
      </EuiPopover>
      {modal}
    </EuiHeaderSectionItemButton>
  );
}
