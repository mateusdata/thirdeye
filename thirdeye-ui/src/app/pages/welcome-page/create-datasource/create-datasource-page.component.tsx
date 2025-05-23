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

import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageHeader } from "../../../components/page-header/page-header.component";
import { PageV1 } from "../../../platform/components";

export const WelcomeOnboardDatasourceWizard: FunctionComponent = () => {
    const { t } = useTranslation();

    return (
        <PageV1>
            <PageHeader
                transparentBackground
                subtitle={t("message.start-monitoring-your-data")}
                title={t("message.welcome-to-thirdeye")}
            />
            <Outlet />
        </PageV1>
    );
};
