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
import { ActionStatus } from "../../../rest/actions.interfaces";
import { Alert, AlertInsight } from "../../../rest/dto/alert.interfaces";
import { Anomaly } from "../../../rest/dto/anomaly.interfaces";
import { EnumerationItem } from "../../../rest/dto/enumeration-item.interfaces";
import { Investigation } from "../../../rest/dto/rca.interfaces";

export type InvestigationContext = {
    investigation: Investigation;
    onInvestigationChange: (modified: Investigation) => void;
    handleServerUpdatedInvestigation: (
        serverInvestigation: Investigation
    ) => void;
    getEnumerationItemRequest: ActionStatus;
    enumerationItem: EnumerationItem | null;
    anomaly: Anomaly;
    getAnomalyRequestStatus: ActionStatus;
    anomalyRequestErrors: string[];
    alert: Alert | null;
    alertInsight: AlertInsight | null;
};
