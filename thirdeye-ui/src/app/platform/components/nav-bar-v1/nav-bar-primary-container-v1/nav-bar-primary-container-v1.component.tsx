/*
 * Copyright 2023 StarTree Inc
 *
 * Licensed under the StarTree Community License (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at http://www.startree.ai/legal/startree-community-license
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT * WARRANTIES OF ANY KIND,
 * either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under
 * the License.
 */
import { List } from "@material-ui/core";
import classNames from "classnames";
import React, { FunctionComponent } from "react";
import { NavBarPrimaryContainerV1Props } from "./nav-bar-primary-container-v1.interfaces";
import { useNavBarPrimaryContainerV1Styles } from "./nav-bar-primary-container-v1.styles";

export const NavBarPrimaryContainerV1: FunctionComponent<NavBarPrimaryContainerV1Props> =
    ({ className, children, ...otherProps }) => {
        const navBarPrimaryContainerV1Classes =
            useNavBarPrimaryContainerV1Styles();

        return (
            <List
                {...otherProps}
                disablePadding
                className={classNames(
                    navBarPrimaryContainerV1Classes.navBarPrimaryContainer,
                    className,
                    "nav-bar-primary-container-v1"
                )}
                component="nav"
            >
                {children}
            </List>
        );
    };
